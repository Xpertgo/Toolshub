# ToolsHub - Image & PDF Online Tools

ToolsHub is a comprehensive web application that provides a wide range of free online tools for processing images and PDF files. The platform is designed to be user-friendly, responsive, and accessible to everyone, regardless of technical expertise.

## Features

### Image Tools
- **Image Compressor**: Reduce image file size while maintaining quality
- **Image Cropper**: Crop and resize images with precision
- **Image Converter**: Convert images between different formats (JPG, PNG, WebP, etc.)
- **Image Resizer**: Resize images to specific dimensions
- **Image Editor**: Edit images with filters, text, and effects
- **Color Picker**: Extract colors from any image
- **Background Remover**: Remove background from images automatically
- **Watermark Maker**: Add text or image watermarks
- **Image to PDF**: Convert images to PDF documents
- **Image Filters**: Apply filters and effects to images
- **Metadata Viewer**: View and edit image metadata (EXIF, IPTC)
- **Text Extractor (OCR)**: Extract text from images using OCR

### PDF Tools
- **PDF Merger**: Combine multiple PDF files into one document
- **PDF Splitter**: Split PDF files into separate documents
- **PDF Compressor**: Reduce PDF file size for easier sharing
- **PDF to Image**: Convert PDF pages to image formats (JPG, PNG)
- **Image to PDF**: Convert images to PDF documents
- **PDF Editor**: Edit text and images in PDF files
- **Page Rotator**: Rotate pages in PDF documents
- **Page Extractor**: Extract specific pages from PDF files
- **PDF to Word**: Convert PDFs to editable Word documents
- **PDF to Excel**: Convert PDF tables to Excel spreadsheets
- **PDF to Text**: Extract plain text from PDF documents
- **Password Protector**: Add password protection to PDF files

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (vanilla)
- **Libraries**:
  - Font Awesome (for icons)
  - PDF.js (for PDF processing)
  - SortableJS (for drag-and-drop reordering)

## Project Structure

```
ToolsHub/
├── index.html            # Home page
├── image-tools.html      # Image tools listing page
├── pdf-tools.html        # PDF tools listing page
├── about.html            # About page
├── css/
│   └── style.css         # Main stylesheet
├── js/
│   └── script.js         # Main JavaScript file
└── tools/
    ├── image-compressor.html  # Sample image tool implementation
    ├── pdf-merger.html        # Sample PDF tool implementation
    └── ... (other tool pages)
```

## Getting Started

1. Clone this repository
2. Open the project in your preferred code editor
3. For development and testing, you can use a local server like Live Server (VS Code extension) or simply open the HTML files directly in your browser

## Customization

### AdSense Integration
To integrate with Google AdSense:
1. Replace `YOUR_ADSENSE_ID` with your actual AdSense publisher ID in all HTML files
2. Replace `YOUR_AD_SLOT` with your ad slot ID

### Adding New Tools
To add a new tool:
1. Create a new HTML file in the `tools/` directory
2. Use the existing tool pages as templates
3. Update the relevant tool listing page (image-tools.html or pdf-tools.html)

## License

This project is open-source and available under the MIT License.

## Contact

For questions, feedback, or suggestions, please use the contact form on the About page.
