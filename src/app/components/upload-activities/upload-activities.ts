import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-upload-activities',
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-activities.html',
  styleUrl: './upload-activities.css',
})
export class UploadActivities implements OnInit {
  selectedFile?: File | null = null;
  previewRows: string[][] = [];
  isDragging = false;
  uploadProgress = 0; // 0..100
  uploading = false;
  message = '';
  error = '';
  maxFileSizeBytes = 10 * 1024 * 1024; // 10 MB - adjust as needed
  allowExtensions = ['.csv'];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void { }

  handleFile(file: File) {
    this.resetStatus();
    // basic validation
    if (!this.isValidExtension(file.name)) {
      this.error = 'Only CSV files are allowed.';
      return;
    }
    if (file.size > this.maxFileSizeBytes) {
      this.error = `File is too large. Max allowed is ${this.maxFileSizeBytes / (1024 * 1024)} MB.`;
      return;
    }
    this.selectedFile = file;
    this.readPreview(file);
  }

  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.handleFile(input.files[0]);
    // reset input value so same file can be selected again if needed
    input.value = '';
  }

  isValidExtension(name: string) {
    const lower = name.toLowerCase();
    return this.allowExtensions.some(ext => lower.endsWith(ext));
  }

  readPreview(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      // take only first few lines safely
      const lines = text.split(/\r\n|\n/).filter(Boolean).slice(0, 6); // include header + 5 rows
      this.previewRows = lines.map(line => this.parseCsvLine(line));
    };
    reader.onerror = () => {
      this.error = 'Failed to read file preview.';
    };
    reader.readAsText(file);
  }

  // very small CSV-line parser (splits on comma, doesn't handle quotes fully)
  parseCsvLine(line: string): string[] {
    // naive split but handles common simple CSVs; extend if needed
    return line.split(',').map(s => s.trim());
  }

  onDrop(ev: DragEvent) {
    ev.preventDefault();
    this.isDragging = false;
    if (ev.dataTransfer?.files && ev.dataTransfer.files.length > 0) {
      this.handleFile(ev.dataTransfer.files[0]);
    }
  }

  onDragOver(ev: DragEvent) {
    ev.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(ev: DragEvent) {
    ev.preventDefault();
    this.isDragging = false;
  }

  upload() {
    this.error = '';
    this.message = '';
    if (!this.selectedFile) {
      this.error = 'No file selected.';
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;

    this.dashboardService.uploadCsvFile(this.selectedFile).pipe(
      finalize(() => (this.uploading = false))
    ).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.Sent) {
          // request sent
        } else if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        } else if (event.type === HttpEventType.Response) {
          // server responded
          this.uploadProgress = 100;
          this.message = 'Upload complete.';
        }
      },
      error: (err) => {
        console.error(err);
        this.error = this.extractErrorMessage(err) || 'Upload failed.';
      }
    });
  }

  extractErrorMessage(err: any): string | null {
    if (!err) return null;
    if (err.error && typeof err.error === 'object') {
      // DRF typical structure may include detail or errors
      return err.error.detail || JSON.stringify(err.error);
    }
    if (err.message) return err.message;
    return String(err);
  }

  clear() {
    this.selectedFile = null;
    this.previewRows = [];
    this.uploadProgress = 0;
    this.message = '';
    this.error = '';
  }

  resetStatus() {
    this.error = '';
    this.message = '';
    this.uploadProgress = 0;
  }

}
