document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Tool search functionality
    const toolSearch = document.getElementById('toolSearch');
    if (toolSearch) {
        toolSearch.addEventListener('keyup', function() {
            const searchValue = this.value.toLowerCase();
            const toolCards = document.querySelectorAll('.tool-card');
            let hasVisibleTools = false;
            
            toolCards.forEach(card => {
                const toolName = card.querySelector('h3').textContent.toLowerCase();
                const toolDescription = card.querySelector('p').textContent.toLowerCase();
                const isComingSoon = card.classList.contains('unavailable');
                
                // Include "coming soon" in the search if the card has that status
                const searchTerms = isComingSoon ? 
                    toolName + ' ' + toolDescription + ' coming soon' : 
                    toolName + ' ' + toolDescription;
                
                if (searchTerms.includes(searchValue)) {
                    card.style.display = 'block';
                    hasVisibleTools = true;
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show a message if no tools match the search
            const noResultsMessage = document.getElementById('noResultsMessage');
            if (!hasVisibleTools && searchValue.length > 0) {
                if (!noResultsMessage) {
                    const message = document.createElement('div');
                    message.id = 'noResultsMessage';
                    message.className = 'section-info';
                    message.innerHTML = `<p>No tools match your search for "${searchValue}". Try a different search term.</p>`;
                    
                    const toolsGrid = document.querySelector('.tools-grid');
                    toolsGrid.parentNode.insertBefore(message, toolsGrid);
                }
            } else if (noResultsMessage) {
                noResultsMessage.remove();
            }
        });
    }

    // AdSense monitoring
    function checkAdBlocker() {
        const adContainer = document.querySelector('.ad-container');
        if (adContainer) {
            // Check if AdSense ads are loaded
            const adElements = adContainer.querySelectorAll('ins.adsbygoogle');
            let adsLoaded = false;
            
            adElements.forEach(ad => {
                // If the ad has content, it's probably loaded
                if (ad.innerHTML.trim().length > 0 && ad.clientHeight > 0) {
                    adsLoaded = true;
                }
            });
            
            // Log ad status for monitoring
            console.log('AdSense status:', adsLoaded ? 'Ads loaded' : 'Ads blocked or not loaded');
            
            // You could implement additional monitoring or analytics here
        }
    }

    // Check ad status after page is fully loaded
    window.addEventListener('load', function() {
        // Wait a bit for ads to load
        setTimeout(checkAdBlocker, 2000);
    });
});

// Image Tools Implementation Stubs

// Image Compressor
function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate new dimensions while maintaining aspect ratio
                let width = img.width;
                let height = img.height;
                const maxWidth = 1920;
                const maxHeight = 1080;
                
                if (width > maxWidth) {
                    height = Math.round(height * maxWidth / width);
                    width = maxWidth;
                }
                if (height > maxHeight) {
                    width = Math.round(width * maxHeight / height);
                    height = maxHeight;
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to blob with reduced quality
                canvas.toBlob(function(blob) {
                    resolve(blob);
                }, file.type, 0.7); // 0.7 quality (70%)
            };
        };
        reader.onerror = function(error) {
            reject(error);
        };
    });
}

// Image Resizer
function resizeImage(file, newWidth, newHeight, maintainAspect = false) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas dimensions to new dimensions
                canvas.width = newWidth;
                canvas.height = newHeight;
                
                // Draw image onto canvas with new dimensions
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                
                // Convert to blob with original quality
                canvas.toBlob(function(blob) {
                    resolve(blob);
                }, file.type, 1.0); // 1.0 quality (100%)
            };
            img.onerror = function(error) {
                reject(error);
            };
        };
        reader.onerror = function(error) {
            reject(error);
        };
    });
}

// Image Editor Functions
// Apply filter to image
function applyFilter(imageData, filterType, value) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const width = imageData.width;
        const height = imageData.height;
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw the original image
        ctx.putImageData(imageData, 0, 0);
        
        // Apply filters based on type
        switch(filterType) {
            case 'grayscale':
                applyGrayscale(ctx, width, height);
                break;
            case 'sepia':
                applySepia(ctx, width, height);
                break;
            case 'brightness':
                applyBrightness(ctx, width, height, value);
                break;
            case 'contrast':
                applyContrast(ctx, width, height, value);
                break;
            case 'blur':
                applyBlur(ctx, width, height, value);
                break;
        }
        
        resolve(ctx.getImageData(0, 0, width, height));
    });
}

// Helper functions for filters
function applyGrayscale(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;       // red
        data[i + 1] = avg;   // green
        data[i + 2] = avg;   // blue
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function applySepia(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function applyBrightness(ctx, width, height, value) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, data[i] + value));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + value));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + value));
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function applyContrast(ctx, width, height, value) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const factor = (259 * (value + 255)) / (255 * (259 - value));
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
        data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
        data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
    }
    
    ctx.putImageData(imageData, 0, 0);
}

function applyBlur(ctx, width, height, value) {
    // Simple box blur
    if (value <= 0) return;
    
    const radius = Math.floor(value);
    const imageData = ctx.getImageData(0, 0, width, height);
    const original = new Uint8ClampedArray(imageData.data);
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, a = 0, count = 0;
            
            // Box blur kernel
            for (let ky = -radius; ky <= radius; ky++) {
                for (let kx = -radius; kx <= radius; kx++) {
                    const offsetX = x + kx;
                    const offsetY = y + ky;
                    
                    if (offsetX >= 0 && offsetX < width && offsetY >= 0 && offsetY < height) {
                        const offset = (offsetY * width + offsetX) * 4;
                        r += original[offset];
                        g += original[offset + 1];
                        b += original[offset + 2];
                        a += original[offset + 3];
                        count++;
                    }
                }
            }
            
            const offset = (y * width + x) * 4;
            data[offset] = r / count;
            data[offset + 1] = g / count;
            data[offset + 2] = b / count;
            data[offset + 3] = a / count;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// Add text to image
function addTextToImage(canvas, text, x, y, fontFamily, fontSize, color) {
    const ctx = canvas.getContext('2d');
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    return canvas;
}

// Rotate image
function rotateImage(canvas, degrees) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Create a temporary canvas to hold the current image
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCtx.drawImage(canvas, 0, 0);
    
    // Clear the original canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set the origin to the center of the canvas
    ctx.translate(width / 2, height / 2);
    
    // Rotate by the specified degrees
    ctx.rotate(degrees * Math.PI / 180);
    
    // Draw the image back with an offset to center it
    ctx.drawImage(tempCanvas, -width / 2, -height / 2);
    
    // Reset the transformation matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    return canvas;
}

// Color Picker Functions
function extractColors(imageElement, numColors = 5) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match the image
        canvas.width = imageElement.naturalWidth;
        canvas.height = imageElement.naturalHeight;
        
        // Draw image onto canvas
        ctx.drawImage(imageElement, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // Process pixels to find dominant colors
        const colorMap = {};
        
        // Sample pixels (skip some for performance)
        for (let i = 0; i < pixels.length; i += 16) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            
            // Skip transparent pixels
            if (a < 128) continue;
            
            // Simplify colors (reduce precision to group similar colors)
            const roundedR = Math.round(r/10) * 10;
            const roundedG = Math.round(g/10) * 10;
            const roundedB = Math.round(b/10) * 10;
            
            const key = `${roundedR},${roundedG},${roundedB}`;
            
            if (!colorMap[key]) {
                colorMap[key] = {
                    color: [r, g, b],
                    count: 1
                };
            } else {
                colorMap[key].count++;
                // Average the color values for more accuracy
                colorMap[key].color[0] = (colorMap[key].color[0] + r) / 2;
                colorMap[key].color[1] = (colorMap[key].color[1] + g) / 2;
                colorMap[key].color[2] = (colorMap[key].color[2] + b) / 2;
            }
        }
        
        // Convert to array and sort by count
        const colors = Object.values(colorMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, numColors)
            .map(item => {
                const [r, g, b] = item.color.map(Math.round);
                return {
                    rgb: `rgb(${r}, ${g}, ${b})`,
                    hex: rgbToHex(r, g, b),
                    count: item.count
                };
            });
        
        resolve(colors);
    });
}

// Helper function to convert RGB to HEX
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

// Get color at specific coordinates
function getColorAtPoint(canvas, x, y) {
    const ctx = canvas.getContext('2d');
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const [r, g, b] = pixel;
    
    return {
        rgb: `rgb(${r}, ${g}, ${b})`,
        hex: rgbToHex(r, g, b)
    };
}

// PDF Tools Implementation Stubs

// PDF Merger (stub)
function mergePDFs(files) {
    // This would use a library like PDF.js or pdf-lib in a real implementation
    console.log('Merging PDFs:', files);
    return new Promise((resolve) => {
        // Simulate processing
        setTimeout(() => {
            resolve({
                success: true,
                message: 'PDFs merged successfully'
            });
        }, 1500);
    });
}

// PDF Splitter (stub)
function splitPDF(file, pages) {
    console.log('Splitting PDF:', file, 'at pages:', pages);
    return new Promise((resolve) => {
        // Simulate processing
        setTimeout(() => {
            resolve({
                success: true,
                message: 'PDF split successfully'
            });
        }, 1500);
    });
}

// Image to PDF Functions
function convertImageToPDF(imageElement, options = {}) {
    return new Promise((resolve) => {
        const defaultOptions = {
            format: 'a4',            // 'a4', 'letter', etc., or [width, height] in mm
            orientation: 'portrait', // 'portrait' or 'landscape'
            pageMargin: 10,          // margin in mm
            compress: true,          // compress the PDF
            quality: 0.95,           // image quality (0-1)
            fileName: 'document.pdf' // default file name
        };
        
        // Merge provided options with defaults
        const settings = { ...defaultOptions, ...options };
        
        // Load jsPDF if it doesn't exist
        if (typeof jsPDF === 'undefined') {
            // Create script element to load jsPDF
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                // Create script element to load html2canvas
                const html2CanvasScript = document.createElement('script');
                html2CanvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                html2CanvasScript.onload = () => {
                    // Both libraries loaded, now create PDF
                    createPDF(imageElement, settings, resolve);
                };
                document.head.appendChild(html2CanvasScript);
            };
            document.head.appendChild(script);
        } else {
            // jsPDF already loaded, create PDF directly
            createPDF(imageElement, settings, resolve);
        }
    });
}

function createPDF(imageElement, settings, resolve) {
    // Get image dimensions
    const imgWidth = imageElement.naturalWidth;
    const imgHeight = imageElement.naturalHeight;
    
    // Create new PDF document
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: settings.orientation,
        unit: 'mm',
        format: settings.format
    });
    
    // Get PDF dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate available space for the image (accounting for margins)
    const availableWidth = pdfWidth - (settings.pageMargin * 2);
    const availableHeight = pdfHeight - (settings.pageMargin * 2);
    
    // Calculate image dimensions to fit in the PDF
    let finalWidth, finalHeight;
    
    // Maintain aspect ratio
    const imgRatio = imgWidth / imgHeight;
    const pdfRatio = availableWidth / availableHeight;
    
    if (imgRatio > pdfRatio) {
        // Image is wider than the PDF ratio
        finalWidth = availableWidth;
        finalHeight = availableWidth / imgRatio;
    } else {
        // Image is taller than the PDF ratio
        finalHeight = availableHeight;
        finalWidth = availableHeight * imgRatio;
    }
    
    // Calculate position to center the image on the page
    const xPos = settings.pageMargin + (availableWidth - finalWidth) / 2;
    const yPos = settings.pageMargin + (availableHeight - finalHeight) / 2;
    
    // Create a canvas element to draw the image for better quality
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match original image for best quality
    canvas.width = imgWidth;
    canvas.height = imgHeight;
    
    // Draw the image onto the canvas
    ctx.drawImage(imageElement, 0, 0);
    
    // Get the data URL from the canvas
    const imgData = canvas.toDataURL('image/jpeg', settings.quality);
    
    // Add the image to the PDF
    pdf.addImage(imgData, 'JPEG', xPos, yPos, finalWidth, finalHeight, '', settings.compress);
    
    // Generate PDF blob
    const pdfBlob = pdf.output('blob');
    
    // Convert to object URL and resolve
    resolve({
        blob: pdfBlob,
        url: URL.createObjectURL(pdfBlob),
        fileName: settings.fileName
    });
}

function convertMultipleImagesToPDF(imageElements, options = {}) {
    return new Promise((resolve) => {
        const defaultOptions = {
            format: 'a4',
            orientation: 'portrait',
            pageMargin: 10,
            compress: true,
            quality: 0.95,
            fileName: 'document.pdf',
            singlePage: false // If true, all images on a single page, otherwise one image per page
        };
        
        // Merge provided options with defaults
        const settings = { ...defaultOptions, ...options };
        
        // Load jsPDF if it doesn't exist
        if (typeof jsPDF === 'undefined') {
            // Create script element to load jsPDF
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                // Create script element to load html2canvas
                const html2CanvasScript = document.createElement('script');
                html2CanvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                html2CanvasScript.onload = () => {
                    // Both libraries loaded, now create PDF
                    createMultiPagePDF(imageElements, settings, resolve);
                };
                document.head.appendChild(html2CanvasScript);
            };
            document.head.appendChild(script);
        } else {
            // jsPDF already loaded, create PDF directly
            createMultiPagePDF(imageElements, settings, resolve);
        }
    });
}

function createMultiPagePDF(imageElements, settings, resolve) {
    // Check if we have images
    if (!imageElements || imageElements.length === 0) {
        resolve({
            error: 'No images provided'
        });
        return;
    }
    
    // Create new PDF document
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: settings.orientation,
        unit: 'mm',
        format: settings.format
    });
    
    // Get PDF dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate available space for images (accounting for margins)
    const availableWidth = pdfWidth - (settings.pageMargin * 2);
    const availableHeight = pdfHeight - (settings.pageMargin * 2);
    
    // Convert images to PDF
    const processImages = async () => {
        if (settings.singlePage) {
            // All images on a single page
            // For single page mode, we'll create a grid layout
            const maxImagesPerRow = 2;
            const rows = Math.ceil(imageElements.length / maxImagesPerRow);
            
            // Calculate image size and spacing
            const imageWidth = availableWidth / Math.min(maxImagesPerRow, imageElements.length);
            const imageHeight = availableHeight / rows;
            const aspectRatio = imageWidth / imageHeight;
            
            for (let i = 0; i < imageElements.length; i++) {
                const img = imageElements[i];
                
                // Calculate position in the grid
                const row = Math.floor(i / maxImagesPerRow);
                const col = i % maxImagesPerRow;
                
                // Calculate position
                const xPos = settings.pageMargin + (col * imageWidth);
                const yPos = settings.pageMargin + (row * imageHeight);
                
                // Create a canvas to draw the image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                
                // Draw image to canvas
                ctx.drawImage(img, 0, 0);
                
                // Get image data
                const imgData = canvas.toDataURL('image/jpeg', settings.quality);
                
                // Calculate dimensions to maintain aspect ratio within the cell
                const imgRatio = img.naturalWidth / img.naturalHeight;
                let finalWidth, finalHeight;
                
                if (imgRatio > aspectRatio) {
                    // Image is wider
                    finalWidth = imageWidth;
                    finalHeight = imageWidth / imgRatio;
                } else {
                    // Image is taller
                    finalHeight = imageHeight;
                    finalWidth = imageHeight * imgRatio;
                }
                
                // Center image in the cell
                const cellXPos = xPos + (imageWidth - finalWidth) / 2;
                const cellYPos = yPos + (imageHeight - finalHeight) / 2;
                
                // Add image to PDF
                pdf.addImage(imgData, 'JPEG', cellXPos, cellYPos, finalWidth, finalHeight, '', settings.compress);
            }
        } else {
            // One image per page
            for (let i = 0; i < imageElements.length; i++) {
                const img = imageElements[i];
                
                // Add a new page for each image except the first one
                if (i > 0) {
                    pdf.addPage();
                }
                
                // Calculate dimensions to fit in the available space
                const imgRatio = img.naturalWidth / img.naturalHeight;
                const pdfRatio = availableWidth / availableHeight;
                let finalWidth, finalHeight;
                
                if (imgRatio > pdfRatio) {
                    // Image is wider
                    finalWidth = availableWidth;
                    finalHeight = availableWidth / imgRatio;
                } else {
                    // Image is taller
                    finalHeight = availableHeight;
                    finalWidth = availableHeight * imgRatio;
                }
                
                // Calculate position to center the image
                const xPos = settings.pageMargin + (availableWidth - finalWidth) / 2;
                const yPos = settings.pageMargin + (availableHeight - finalHeight) / 2;
                
                // Create a canvas to draw the image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                
                // Draw image to canvas
                ctx.drawImage(img, 0, 0);
                
                // Get image data
                const imgData = canvas.toDataURL('image/jpeg', settings.quality);
                
                // Add image to PDF
                pdf.addImage(imgData, 'JPEG', xPos, yPos, finalWidth, finalHeight, '', settings.compress);
            }
        }
        
        // Generate PDF blob
        const pdfBlob = pdf.output('blob');
        
        // Convert to object URL and resolve
        resolve({
            blob: pdfBlob,
            url: URL.createObjectURL(pdfBlob),
            fileName: settings.fileName
        });
    };
    
    // Start processing images
    processImages();
}

// OCR Functions
function extractTextFromImage(imageElement, language = 'eng', progressCallback) {
    return new Promise((resolve, reject) => {
        // Check if Tesseract.js is loaded
        if (typeof Tesseract === 'undefined') {
            // Load Tesseract.js
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/tesseract.js@v2.1.0/dist/tesseract.min.js';
            script.onload = () => {
                performOCR(imageElement, language, progressCallback, resolve, reject);
            };
            script.onerror = () => {
                reject(new Error('Failed to load Tesseract.js'));
            };
            document.head.appendChild(script);
        } else {
            performOCR(imageElement, language, progressCallback, resolve, reject);
        }
    });
}

function performOCR(imageElement, language, progressCallback, resolve, reject) {
    Tesseract.recognize(
        imageElement,
        language,
        {
            logger: progress => {
                if (typeof progressCallback === 'function') {
                    progressCallback(progress);
                }
            }
        }
    ).then(result => {
        resolve({
            text: result.data.text,
            confidence: result.data.confidence,
            words: result.data.words,
            lines: result.data.lines
        });
    }).catch(error => {
        reject(error);
    });
}

// Helper function to map progress status to percentage
function calculateOcrProgress(progress) {
    let percentage = 0;
    
    switch(progress.status) {
        case 'loading tesseract core':
            percentage = 10;
            break;
        case 'initializing tesseract':
            percentage = 20;
            break;
        case 'loading language traineddata':
            percentage = 30;
            break;
        case 'initializing api':
            percentage = 40;
            break;
        case 'recognizing text':
            percentage = 50 + (progress.progress * 50);
            break;
    }
    
    return {
        percentage: percentage,
        status: progress.status,
        progress: progress.progress
    };
}

// Common utility functions

// File size formatter
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Download helper
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// File validation
function validateFileType(file, allowedTypes) {
    return allowedTypes.includes(file.type);
}

// Error handler
function showError(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.textContent = message;
    
    document.body.appendChild(errorContainer);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorContainer.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(errorContainer);
        }, 500);
    }, 5000);
}

// Background Remover Function - Simple version
function removeBackground(imageElement, threshold = 20) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match the image
        canvas.width = imageElement.naturalWidth;
        canvas.height = imageElement.naturalHeight;
        
        // Draw image onto canvas
        ctx.drawImage(imageElement, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Sample more points to detect the background color more accurately
        // Include not just corners but also edges and center
        const samplePoints = [
            // Four corners
            {x: 0, y: 0},                              // Top-left
            {x: canvas.width - 1, y: 0},               // Top-right
            {x: 0, y: canvas.height - 1},              // Bottom-left
            {x: canvas.width - 1, y: canvas.height - 1}, // Bottom-right
            
            // Mid points of edges
            {x: Math.floor(canvas.width / 2), y: 0},               // Top middle
            {x: Math.floor(canvas.width / 2), y: canvas.height - 1}, // Bottom middle
            {x: 0, y: Math.floor(canvas.height / 2)},               // Left middle
            {x: canvas.width - 1, y: Math.floor(canvas.height / 2)}, // Right middle
            
            // Additional edge points for better sampling
            {x: Math.floor(canvas.width / 4), y: 0},                // Top quarter
            {x: Math.floor(3 * canvas.width / 4), y: 0},            // Top three-quarter
            {x: Math.floor(canvas.width / 4), y: canvas.height - 1}, // Bottom quarter
            {x: Math.floor(3 * canvas.width / 4), y: canvas.height - 1} // Bottom three-quarter
        ];
        
        // Calculate the average background color from sample points
        let colorSamples = [];
        
        samplePoints.forEach(point => {
            const idx = (point.y * canvas.width + point.x) * 4;
            colorSamples.push({
                r: data[idx],
                g: data[idx + 1],
                b: data[idx + 2]
            });
        });
        
        // Find the most common color in the samples (simple clustering)
        const colorClusters = {};
        
        colorSamples.forEach(color => {
            // Reduce precision to group similar colors
            const roundedR = Math.round(color.r / 10) * 10;
            const roundedG = Math.round(color.g / 10) * 10;
            const roundedB = Math.round(color.b / 10) * 10;
            
            const key = `${roundedR},${roundedG},${roundedB}`;
            
            if (!colorClusters[key]) {
                colorClusters[key] = {
                    count: 1,
                    r: color.r,
                    g: color.g,
                    b: color.b
                };
            } else {
                colorClusters[key].count++;
            }
        });
        
        // Find the most common color cluster
        let maxCount = 0;
        let bgColor = { r: 255, g: 255, b: 255 }; // Default to white
        
        for (const key in colorClusters) {
            if (colorClusters[key].count > maxCount) {
                maxCount = colorClusters[key].count;
                bgColor = {
                    r: colorClusters[key].r,
                    g: colorClusters[key].g,
                    b: colorClusters[key].b
                };
            }
        }
        
        // Process the image data to remove background with smoother edges
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Calculate color distance from the background color
            const colorDistance = Math.sqrt(
                Math.pow(r - bgColor.r, 2) +
                Math.pow(g - bgColor.g, 2) +
                Math.pow(b - bgColor.b, 2)
            );
            
            // Use threshold to determine transparency with smoothing
            if (colorDistance < threshold) {
                // Calculate alpha based on the distance for smoother edges
                const alpha = Math.min(255, Math.max(0, colorDistance * (255 / threshold)));
                data[i + 3] = alpha; // Set alpha channel
            }
        }
        
        // Put the modified image data back
        ctx.putImageData(imageData, 0, 0);
        
        // Convert canvas to Blob and resolve
        canvas.toBlob(blob => {
            resolve({
                blob: blob,
                url: URL.createObjectURL(blob),
                canvas: canvas
            });
        }, 'image/png');
    });
}

// Enhanced Background Removal using advanced color segmentation
function removeBackgroundAdvanced(imageElement, sensitivity = 30) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match the image
        canvas.width = imageElement.naturalWidth;
        canvas.height = imageElement.naturalHeight;
        
        // Draw image onto canvas
        ctx.drawImage(imageElement, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;
        
        // Create a more comprehensive edge sampling strategy
        const edgePixels = [];
        const maxSamples = 200; // Limit the number of samples for performance
        
        // Calculate sampling interval based on image dimensions
        const sampleXInterval = Math.max(1, Math.floor(width / (maxSamples / 4)));
        const sampleYInterval = Math.max(1, Math.floor(height / (maxSamples / 4)));
        
        // Sample top and bottom edges
        for (let x = 0; x < width; x += sampleXInterval) {
            // Sample from multiple rows (not just the very edge) for better detection
            for (let offset = 0; offset < 3; offset++) {
                // Top edges (first 3 rows)
                if (offset < height) {
                    const idx = (offset * width + x) * 4;
                    edgePixels.push({
                        r: data[idx],
                        g: data[idx + 1],
                        b: data[idx + 2],
                        x: x,
                        y: offset
                    });
                }
                
                // Bottom edges (last 3 rows)
                const bottomY = height - 1 - offset;
                if (bottomY >= 0 && bottomY < height) {
                    const idx = (bottomY * width + x) * 4;
                    edgePixels.push({
                        r: data[idx],
                        g: data[idx + 1],
                        b: data[idx + 2],
                        x: x,
                        y: bottomY
                    });
                }
            }
        }
        
        // Sample left and right edges
        for (let y = 0; y < height; y += sampleYInterval) {
            // Sample from multiple columns (not just the very edge)
            for (let offset = 0; offset < 3; offset++) {
                // Left edges (first 3 columns)
                if (offset < width) {
                    const idx = (y * width + offset) * 4;
                    edgePixels.push({
                        r: data[idx],
                        g: data[idx + 1],
                        b: data[idx + 2],
                        x: offset,
                        y: y
                    });
                }
                
                // Right edges (last 3 columns)
                const rightX = width - 1 - offset;
                if (rightX >= 0 && rightX < width) {
                    const idx = (y * width + rightX) * 4;
                    edgePixels.push({
                        r: data[idx],
                        g: data[idx + 1],
                        b: data[idx + 2],
                        x: rightX,
                        y: y
                    });
                }
            }
        }
        
        // Improved color clustering algorithm
        const colorClusters = {};
        
        edgePixels.forEach(pixel => {
            // Use smaller bins for greater precision
            const roundedR = Math.round(pixel.r / 5) * 5;
            const roundedG = Math.round(pixel.g / 5) * 5;
            const roundedB = Math.round(pixel.b / 5) * 5;
            
            const key = `${roundedR},${roundedG},${roundedB}`;
            
            if (!colorClusters[key]) {
                colorClusters[key] = {
                    count: 1,
                    r: pixel.r,
                    g: pixel.g,
                    b: pixel.b,
                    pixels: [pixel]
                };
            } else {
                colorClusters[key].count++;
                colorClusters[key].pixels.push(pixel);
                // Average the color values for more accuracy
                colorClusters[key].r = Math.round((colorClusters[key].r * (colorClusters[key].count - 1) + pixel.r) / colorClusters[key].count);
                colorClusters[key].g = Math.round((colorClusters[key].g * (colorClusters[key].count - 1) + pixel.g) / colorClusters[key].count);
                colorClusters[key].b = Math.round((colorClusters[key].b * (colorClusters[key].count - 1) + pixel.b) / colorClusters[key].count);
            }
        });
        
        // Sort clusters by count to find the most common colors
        const sortedClusters = Object.values(colorClusters).sort((a, b) => b.count - a.count);
        
        // Take the top clusters that represent at least 25% of the edge pixels
        const topClusters = [];
        let totalPixels = 0;
        let requiredPixels = edgePixels.length * 0.25;
        
        for (const cluster of sortedClusters) {
            topClusters.push(cluster);
            totalPixels += cluster.count;
            if (totalPixels >= requiredPixels) break;
        }
        
        // Process each pixel with improved background detection
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Check if this pixel is close to any of the background clusters
            let minDistance = Infinity;
            for (const cluster of topClusters) {
                const colorDistance = Math.sqrt(
                    Math.pow(r - cluster.r, 2) +
                    Math.pow(g - cluster.g, 2) +
                    Math.pow(b - cluster.b, 2)
                );
                minDistance = Math.min(minDistance, colorDistance);
            }
            
            // Apply a gradual transparency based on distance from background clusters
            if (minDistance < sensitivity) {
                // Create a smooth gradient of transparency
                const alpha = Math.min(255, Math.max(0, minDistance * (255 / sensitivity)));
                data[i + 3] = alpha;
            }
        }
        
        // Apply a post-processing smoothing pass for better edges
        const tempData = new Uint8ClampedArray(data);
        
        // Simple 3x3 box blur for alpha channel to smooth edges
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4 + 3; // Alpha channel
                
                // Get surrounding alpha values
                let alphaSum = 0;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        const neighborIdx = ((y + dy) * width + (x + dx)) * 4 + 3;
                        alphaSum += tempData[neighborIdx];
                    }
                }
                
                // Average alpha values (9 pixels in 3x3 grid)
                data[idx] = Math.round(alphaSum / 9);
            }
        }
        
        // Put the modified image data back
        ctx.putImageData(imageData, 0, 0);
        
        // Convert canvas to Blob and resolve
        canvas.toBlob(blob => {
            resolve({
                blob: blob,
                url: URL.createObjectURL(blob),
                canvas: canvas
            });
        }, 'image/png');
    });
}

// Watermark Maker Functions
function addTextWatermark(imageElement, text, options = {}) {
    return new Promise((resolve) => {
        const defaultOptions = {
            position: 'center', // center, topLeft, topRight, bottomLeft, bottomRight, custom
            customX: 0,
            customY: 0,
            fontSize: 36,
            fontFamily: 'Arial, sans-serif',
            color: 'rgba(255, 255, 255, 0.5)',
            rotation: 0,
            repeat: false,
            repeatGap: 100
        };
        
        // Merge provided options with defaults
        const settings = { ...defaultOptions, ...options };
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match the image
        canvas.width = imageElement.naturalWidth;
        canvas.height = imageElement.naturalHeight;
        
        // Draw image onto canvas
        ctx.drawImage(imageElement, 0, 0);
        
        // Apply text watermark
        ctx.save();
        
        // Set font properties
        ctx.font = `${settings.fontSize}px ${settings.fontFamily}`;
        ctx.fillStyle = settings.color;
        
        // Calculate text metrics
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = settings.fontSize; // Approximation
        
        if (settings.repeat) {
            // Apply repeated watermark pattern
            applyRepeatedWatermark(ctx, text, textWidth, textHeight, settings, canvas.width, canvas.height);
        } else {
            // Apply single watermark
            applySingleWatermark(ctx, text, textWidth, textHeight, settings, canvas.width, canvas.height);
        }
        
        ctx.restore();
        
        // Convert canvas to Blob and resolve
        canvas.toBlob(blob => {
            resolve({
                blob: blob,
                url: URL.createObjectURL(blob),
                canvas: canvas
            });
        });
    });
}

function applySingleWatermark(ctx, text, textWidth, textHeight, settings, canvasWidth, canvasHeight) {
    // Calculate position
    let x, y;
    
    switch (settings.position) {
        case 'topLeft':
            x = 20;
            y = textHeight + 10;
            break;
        case 'topRight':
            x = canvasWidth - textWidth - 20;
            y = textHeight + 10;
            break;
        case 'bottomLeft':
            x = 20;
            y = canvasHeight - 20;
            break;
        case 'bottomRight':
            x = canvasWidth - textWidth - 20;
            y = canvasHeight - 20;
            break;
        case 'custom':
            x = settings.customX;
            y = settings.customY;
            break;
        case 'center':
        default:
            x = (canvasWidth - textWidth) / 2;
            y = (canvasHeight + textHeight) / 2;
            break;
    }
    
    // Apply rotation if needed
    if (settings.rotation !== 0) {
        // Translate to the center of where the text will be placed
        ctx.translate(x + textWidth / 2, y - textHeight / 2);
        // Rotate the canvas
        ctx.rotate(settings.rotation * Math.PI / 180);
        // Translate back, but centered at origin
        ctx.translate(-(textWidth / 2), -(textHeight / 2));
        // Adjust x, y to draw at origin after transformations
        x = 0;
        y = textHeight;
    }
    
    // Draw the text
    ctx.fillText(text, x, y);
}

function applyRepeatedWatermark(ctx, text, textWidth, textHeight, settings, canvasWidth, canvasHeight) {
    // For repeated pattern we use a diagonal layout
    const gap = settings.repeatGap;
    const angle = settings.rotation * Math.PI / 180;
    
    // Create a grid of watermarks
    for (let y = -textHeight; y < canvasHeight + textHeight; y += gap) {
        for (let x = -textWidth; x < canvasWidth + textWidth; x += gap) {
            ctx.save();
            
            // Position and rotate each watermark
            ctx.translate(x + textWidth / 2, y + textHeight / 2);
            ctx.rotate(angle);
            ctx.translate(-textWidth / 2, -textHeight / 2);
            
            // Draw with reduced opacity
            ctx.fillText(text, 0, textHeight);
            
            ctx.restore();
        }
    }
}

function addImageWatermark(baseImageElement, watermarkImageElement, options = {}) {
    return new Promise((resolve) => {
        const defaultOptions = {
            position: 'center', // center, topLeft, topRight, bottomLeft, bottomRight, custom
            customX: 0,
            customY: 0,
            scale: 0.2, // Scale relative to base image
            opacity: 0.5,
            rotation: 0,
            repeat: false,
            repeatGap: 200
        };
        
        // Merge provided options with defaults
        const settings = { ...defaultOptions, ...options };
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match the base image
        canvas.width = baseImageElement.naturalWidth;
        canvas.height = baseImageElement.naturalHeight;
        
        // Draw base image onto canvas
        ctx.drawImage(baseImageElement, 0, 0);
        
        // Calculate watermark dimensions
        const baseWidth = canvas.width;
        const baseHeight = canvas.height;
        
        // Calculate watermark size based on scale
        const watermarkWidth = watermarkImageElement.naturalWidth * settings.scale;
        const watermarkHeight = watermarkImageElement.naturalHeight * settings.scale;
        
        // Set global alpha for transparency
        ctx.globalAlpha = settings.opacity;
        
        if (settings.repeat) {
            // Apply repeated watermark pattern
            applyRepeatedImageWatermark(ctx, watermarkImageElement, watermarkWidth, watermarkHeight, settings, baseWidth, baseHeight);
        } else {
            // Apply single watermark
            applySingleImageWatermark(ctx, watermarkImageElement, watermarkWidth, watermarkHeight, settings, baseWidth, baseHeight);
        }
        
        // Reset global alpha
        ctx.globalAlpha = 1.0;
        
        // Convert canvas to Blob and resolve
        canvas.toBlob(blob => {
            resolve({
                blob: blob,
                url: URL.createObjectURL(blob),
                canvas: canvas
            });
        });
    });
}

function applySingleImageWatermark(ctx, watermarkImage, width, height, settings, baseWidth, baseHeight) {
    // Calculate position
    let x, y;
    
    switch (settings.position) {
        case 'topLeft':
            x = 20;
            y = 20;
            break;
        case 'topRight':
            x = baseWidth - width - 20;
            y = 20;
            break;
        case 'bottomLeft':
            x = 20;
            y = baseHeight - height - 20;
            break;
        case 'bottomRight':
            x = baseWidth - width - 20;
            y = baseHeight - height - 20;
            break;
        case 'custom':
            x = settings.customX;
            y = settings.customY;
            break;
        case 'center':
        default:
            x = (baseWidth - width) / 2;
            y = (baseHeight - height) / 2;
            break;
    }
    
    // Apply rotation if needed
    if (settings.rotation !== 0) {
        // Translate to the center of where the image will be placed
        ctx.translate(x + width / 2, y + height / 2);
        // Rotate the canvas
        ctx.rotate(settings.rotation * Math.PI / 180);
        // Translate back, but centered at origin
        ctx.translate(-width / 2, -height / 2);
        // Adjust x, y to draw at origin after transformations
        x = 0;
        y = 0;
    }
    
    // Draw the watermark image
    ctx.drawImage(watermarkImage, x, y, width, height);
}

function applyRepeatedImageWatermark(ctx, watermarkImage, width, height, settings, baseWidth, baseHeight) {
    // For repeated pattern we use a grid layout
    const gap = settings.repeatGap;
    const angle = settings.rotation * Math.PI / 180;
    
    // Create a grid of watermarks
    for (let y = -height; y < baseHeight + height; y += gap + height) {
        for (let x = -width; x < baseWidth + width; x += gap + width) {
            ctx.save();
            
            // Position and rotate each watermark
            ctx.translate(x + width / 2, y + height / 2);
            ctx.rotate(angle);
            ctx.translate(-width / 2, -height / 2);
            
            // Draw watermark
            ctx.drawImage(watermarkImage, 0, 0, width, height);
            
            ctx.restore();
        }
    }
}
