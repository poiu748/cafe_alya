import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="qr-code-container">
      <div class="qr-header">
        <h3>📱 Menu Client - QR Code</h3>
        <p>Scannez ce code pour accéder au menu</p>
      </div>
      <canvas #qrCanvas class="qr-canvas"></canvas>
      <div class="qr-url">
        <p>{{clientUrl}}</p>
      </div>
      <button class="btn btn-primary" (click)="downloadQR()">📥 Télécharger QR Code</button>
    </div>
  `,
  styles: [`
    .qr-code-container {
      background: var(--bg-secondary);
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: var(--shadow-md);
    }

    .qr-header {
      margin-bottom: 1.5rem;
    }

    .qr-header h3 {
      color: var(--coffee-gold);
      margin-bottom: 0.5rem;
    }

    .qr-header p {
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .qr-canvas {
      display: block;
      margin: 0 auto 1rem;
      border: 4px solid var(--coffee-gold);
      border-radius: 8px;
      background: white;
      padding: 0.5rem;
    }

    .qr-url {
      margin: 1rem 0;
      padding: 0.75rem;
      background: var(--bg-primary);
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.85rem;
      color: var(--coffee-gold);
    }

    .btn {
      margin-top: 1rem;
    }
  `]
})
export class QrCodeComponent implements OnInit {
  @ViewChild('qrCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  clientUrl: string = '';

  ngOnInit() {
    // Get the full URL for the client menu
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;

    // Use the current hostname (will be IP if accessed via IP, localhost if accessed via localhost)
    this.clientUrl = `${protocol}//${hostname}${port ? ':' + port : ''}/client/menu`;

    // Generate QR code
    this.generateQRCode();
  }

  async generateQRCode() {
    try {
      await QRCode.toCanvas(this.canvas.nativeElement, this.clientUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#2C1810',
          light: '#FFFFFF'
        }
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }

  downloadQR() {
    const canvas = this.canvas.nativeElement;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'menu-client-qrcode.png';
    link.href = url;
    link.click();
  }
}
