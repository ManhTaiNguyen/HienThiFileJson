export function createTextElement(element, slide) {
    const text = document.createElement('div');
    text.className = 'text-element';
    text.style.left = `${element.left}px`;
    text.style.top = `${element.top}px`;
    text.style.width = `${element.width}px`;
    text.style.height = `${element.height}px`;
    
    // Áp dụng các thuộc tính văn bản
    if (element.defaultFontName) {
        text.style.fontFamily = element.defaultFontName;
    }
    
    if (element.defaultColor) {
        text.style.color = element.defaultColor;
    }
    
    if (element.lineHeight) {
        text.style.lineHeight = element.lineHeight;
    }
    
    if (element.wordSpace) {
        text.style.wordSpacing = `${element.wordSpace}px`;
    }
    
    if (element.rotate) {
        text.style.transform = `rotate(${element.rotate}deg)`;
        text.style.transformOrigin = 'center center';
    }
    
    // Xử lý căn chỉnh văn bản từ nội dung HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = element.content;
    const paragraphs = tempDiv.querySelectorAll('p');
    
    if (paragraphs.length > 0) {
        paragraphs.forEach(p => {
            const style = p.getAttribute('style');
            if (style && style.includes('text-align')) {
                text.style.textAlign = style.match(/text-align:\s*([^;]+)/)[1];
                p.style.textAlign = 'inherit';
            }
            text.appendChild(p);
        });
    } else {
        text.innerHTML = element.content;
    }
    
    // Đảm bảo văn bản có thể xuống dòng
    text.style.whiteSpace = 'normal';
    text.style.overflow = 'hidden';
    
    slide.appendChild(text);
}