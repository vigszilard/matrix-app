'use client';

import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { InterviewData } from '../types';

interface PDFExportProps {
  interviewData: InterviewData;
  children: React.ReactNode;
}

export const PDFExport: React.FC<PDFExportProps> = ({ interviewData, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const exportToPDF = async () => {
    if (!contentRef.current) return;

    try {
      // Show loading state
      const button = document.querySelector('[data-pdf-button]') as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.textContent = 'Generating PDF...';
      }

      // Generate canvas from HTML content
      const canvas = await html2canvas(contentRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        width: contentRef.current?.scrollWidth,
        height: contentRef.current?.scrollHeight,
        onclone: (clonedDoc: Document) => {
          // Remove all existing stylesheets to avoid lab() color functions
          const existingStyles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
          existingStyles.forEach(style => style.remove());
          
          // Remove the back to homepage button
          const backButton = clonedDoc.querySelector('button[onclick*="router.push"]');
          if (backButton) {
            backButton.remove();
          }
          
          // Remove the PDF export button
          const pdfButton = clonedDoc.querySelector('[data-pdf-button]');
          if (pdfButton) {
            pdfButton.remove();
          }
          
          // Replace connection status with current date
          const connectionStatus = clonedDoc.querySelector('.flex.items-center.space-x-2');
          if (connectionStatus) {
            const currentDate = new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            connectionStatus.innerHTML = `
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600 font-medium">Interview Date:</span>
                <span class="text-sm text-gray-900 font-semibold">${currentDate}</span>
              </div>
            `;
          }
          
          // Add our own clean CSS with only standard hex colors
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            
            body {
              font-family: 'Arial', 'Helvetica', sans-serif;
              background-color: #f9fafb;
              color: #111827;
              line-height: 1.5;
              margin: 0;
              padding: 0;
            }
            
            .pdf-content {
              background-color: #ffffff;
              padding: 20px 30px 60px 30px;
              max-width: 1000px;
              margin: 0 auto;
              font-size: 12px;
              line-height: 1.4;
              font-family: 'Arial', 'Helvetica', sans-serif;
              color: #333333;
              min-height: 100vh;
            }
            
            .bg-white {
              background-color: #ffffff !important;
            }
            
            .text-gray-900 {
              color: #111827 !important;
            }
            
            .text-gray-700 {
              color: #374151 !important;
            }
            
            .text-gray-600 {
              color: #4b5563 !important;
            }
            
            .text-blue-700 {
              color: #1d4ed8 !important;
            }
            
            .text-blue-900 {
              color: #1e3a8a !important;
            }
            
            .text-green-700 {
              color: #15803d !important;
            }
            
            .text-green-900 {
              color: #14532d !important;
            }
            
            .border-gray-300 {
              border-color: #d1d5db !important;
            }
            
            .rounded-lg {
              border-radius: 8px;
            }
            
            .shadow {
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            .p-6 {
              padding: 24px;
            }
            
            .mb-6 {
              margin-bottom: 24px;
            }
            
            .mb-4 {
              margin-bottom: 16px;
            }
            
            .mb-2 {
              margin-bottom: 8px;
            }
            
            .mt-8 {
              margin-top: 32px;
            }
            
            .text-center {
              text-align: center;
            }
            
            .text-2xl {
              font-size: 24px;
            }
            
            .text-xl {
              font-size: 20px;
            }
            
            .text-lg {
              font-size: 18px;
            }
            
            .font-bold {
              font-weight: 700;
            }
            
            .font-semibold {
              font-weight: 600;
            }
            
            .font-medium {
              font-weight: 500;
            }
            
            .grid {
              display: grid;
            }
            
            .grid-cols-1 {
              grid-template-columns: repeat(1, minmax(0, 1fr));
            }
            
            .md\\:grid-cols-3 {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
            
            .gap-4 {
              gap: 16px;
            }
            
            .space-y-6 > * + * {
              margin-top: 24px;
            }
            
            .space-y-4 > * + * {
              margin-top: 16px;
            }
            
            .space-y-2 > * + * {
              margin-top: 8px;
            }
            
            .space-x-6 > * + * {
              margin-left: 24px;
            }
            
            .space-x-2 > * + * {
              margin-left: 8px;
            }
            
            .flex {
              display: flex;
            }
            
            .items-center {
              align-items: center;
            }
            
            .justify-between {
              justify-content: space-between;
            }
            
            .justify-start {
              justify-content: flex-start;
            }
            
            .w-3 {
              width: 12px;
            }
            
            .h-3 {
              height: 12px;
            }
            
            .rounded-full {
              border-radius: 9999px;
            }
            
            .bg-green-500 {
              background-color: #10b981;
            }
            
            .bg-blue-600 {
              background-color: #1d4ed8;
            }
            
            .hover\\:bg-blue-700:hover {
              background-color: #1e40af;
            }
            
            .text-white {
              color: #ffffff;
            }
            
            .py-2 {
              padding-top: 8px;
              padding-bottom: 8px;
            }
            
            .px-6 {
              padding-left: 24px;
              padding-right: 24px;
            }
            
            .disabled\\:opacity-50:disabled {
              opacity: 0.5;
            }
            
            .disabled\\:cursor-not-allowed:disabled {
              cursor: not-allowed;
            }
            
            input[type="range"] {
              width: 80px;
              height: 8px;
              border-radius: 4px;
              background: #e5e7eb;
              outline: none;
              -webkit-appearance: none;
            }
            
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #3b82f6;
              cursor: pointer;
              border: 2px solid #ffffff;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            input[type="range"]::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #3b82f6;
              cursor: pointer;
              border: 2px solid #ffffff;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            textarea {
              width: 100%;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              padding: 12px;
              color: #111827;
              background-color: #ffffff;
              resize: vertical;
              font-family: Arial, sans-serif;
              font-size: 14px;
              line-height: 1.4;
            }
            
            /* Skill rating specific styles */
            .skill-rating {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 8px;
              padding: 8px 0;
            }
            
            .skill-name {
              font-weight: 500;
              color: #111827;
              flex: 1;
              margin-right: 16px;
            }
            
            .interviewer-rating {
              display: flex;
              align-items: center;
              margin-left: 16px;
              min-width: 120px;
            }
            
            .interviewer-label {
              font-size: 12px;
              font-weight: 600;
              margin-right: 8px;
              min-width: 60px;
            }
            
            .rating-display {
              font-size: 12px;
              font-weight: 600;
              min-width: 30px;
              text-align: center;
            }
            
            /* Category average styling */
            .category-average {
              background-color: #f3f4f6;
              padding: 12px;
              border-radius: 6px;
              margin: 16px 0;
              font-weight: 600;
            }
            
            .average-item {
              margin-bottom: 4px;
            }
            
            /* Comments section styling */
            .comments-section {
              margin-top: 16px;
              padding-top: 16px;
              border-top: 1px solid #e5e7eb;
            }
            
            .comment-item {
              margin-bottom: 12px;
            }
            
            .comment-label {
              font-weight: 600;
              margin-bottom: 6px;
              font-size: 11px;
              color: #6b7280;
              display: block;
            }
            
            /* Better spacing for main sections */
            .main-section {
              margin-bottom: 24px;
            }
            
            .section-title {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 16px;
              color: #111827;
            }
            
            /* Specialization section */
            .specialization-section {
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            
            .radio-group {
              display: flex;
              gap: 24px;
              margin-bottom: 16px;
            }
            
            .radio-item {
              display: flex;
              align-items: center;
              font-weight: 500;
            }
            
            .automation-tools {
              margin-left: 24px;
              margin-top: 16px;
            }
            
            .checkbox-group {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            
            .checkbox-item {
              display: flex;
              align-items: center;
              font-weight: 500;
            }
            
            /* Header section improvements */
            .header-section {
              background-color: #ffffff;
              padding: 24px;
              border-radius: 8px;
              margin-bottom: 24px;
              border-bottom: 3px solid #3b82f6;
            }
            
            .header-title {
              font-size: 28px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 20px;
              text-align: center;
            }
            
            .date-status {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              margin-bottom: 16px;
            }
            
            .date-label {
              font-size: 14px;
              color: #4b5563;
              font-weight: 500;
              margin-right: 8px;
            }
            
            .date-value {
              font-size: 14px;
              color: #111827;
              font-weight: 600;
            }
            
            .interviewer-info {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 24px;
              margin-top: 16px;
            }
            
            .info-item {
              text-align: center;
            }
            
            .info-label {
              font-size: 14px;
              font-weight: 600;
              color: #374151;
              margin-bottom: 8px;
            }
            
            .info-value {
              font-size: 18px;
              font-weight: 700;
              color: #111827;
            }
            
            .info-value.blue {
              color: #1d4ed8;
            }
            
            .info-value.green {
              color: #15803d;
            }
            
            @media (min-width: 768px) {
              .md\\:grid-cols-3 {
                grid-template-columns: repeat(3, minmax(0, 1fr));
              }
            }
            
            /* Ensure proper bottom margins for PDF */
            .skills-section:last-child {
              margin-bottom: 40px !important;
            }
            
            .min-h-screen {
              padding-bottom: 40px !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      } as any);

      // Create PDF with proper margins
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 15; // 15mm margins on all sides
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);
      
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = margin;

      // Add first page
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= contentHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= contentHeight;
      }

      // Generate filename
      const filename = `technical-feedback-${interviewData.candidateName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Download PDF
      pdf.save(filename);

      // Reset button state
      if (button) {
        button.disabled = false;
        button.textContent = 'Export to PDF';
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
      
      // Reset button state
      const button = document.querySelector('[data-pdf-button]') as HTMLButtonElement;
      if (button) {
        button.disabled = false;
        button.textContent = 'Export to PDF';
      }
    }
  };

  return (
    <>
      <div ref={contentRef} className="pdf-content">
        {children}
      </div>
      <div className="mt-8 mb-8 text-center">
        <button
          data-pdf-button
          onClick={exportToPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Export to PDF
        </button>
      </div>
    </>
  );
};
