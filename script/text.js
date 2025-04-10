export function createTextElement(element, slide) {
    const text = document.createElement('div');
    text.className = 'text-element';
    text.style.position = 'absolute';
    text.style.left = `${element.left}px`;
    text.style.top = `${element.top}px`;
    text.style.width = `${element.width}px`;
    text.style.height = `${element.height}px`;
    text.style.boxSizing = 'border-box';

    // Thiết lập font và màu mặc định
    text.style.fontFamily = element.defaultFontName || 'Arial';
    text.style.color = element.defaultColor || '#333';

    // Thiết lập line height và word spacing
    if (element.lineHeight) {
        text.style.lineHeight = String(element.lineHeight);
    }
    if (element.wordSpace) {
        text.style.wordSpacing = `${element.wordSpace}px`;
    }

    // Xử lý text vertical
    if (element.vertical) {
        text.style.writingMode = 'vertical-rl';
        text.style.textOrientation = 'upright';
        text.style.textAlign = 'center';
        text.style.display = 'flex';
        text.style.justifyContent = 'flex-start';
        text.style.alignItems = 'center';
    }

    // Xử lý màu nền
    if (element.fill) {
        if (element.fill.startsWith('rgb(') || element.fill.startsWith('#')) {
            text.style.backgroundColor = element.fill;
        } else {
            // Xử lý các định dạng màu khác nếu cần
            text.style.backgroundColor = element.fill;
        }
    }

    // Xử lý outline
    if (element.outline) {
        const outline = element.outline;
        text.style.borderWidth = `${outline.width || 1}px`;
        text.style.borderStyle = outline.style || 'solid';
        text.style.borderColor = outline.color || '#525252';
    }

    // Xử lý shadow
    if (element.shadow) {
        const sh = element.shadow;
        text.style.filter = `drop-shadow(${sh.h || 3}px ${sh.v || 3}px ${sh.blur || 2}px ${sh.color || '#808080'})`;
    }

    // Xử lý xoay
    if (element.rotate) {
        text.style.transform = `rotate(${element.rotate}deg)`;
        text.style.transformOrigin = 'center center';
    }

    // Tạo container tạm thời để phân tích HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = element.content;

    // Tìm container chính (ProseMirror hoặc div gốc)
    let mainContainer = tempDiv.querySelector('div.ProseMirror') || tempDiv;

    // Xử lý từng node con
    const processNode = (node) => {
        // Clone node để tránh ảnh hưởng đến DOM gốc
        const clonedNode = node.cloneNode(true);
        
        // Xử lý các thẻ đặc biệt
        switch (clonedNode.tagName) {
            case 'P':
                // Xử lý text-align và padding
                const pStyle = clonedNode.getAttribute('style') || '';
                if (pStyle.includes('text-align')) {
                    const alignMatch = pStyle.match(/text-align:\s*([^;]+)/);
                    if (alignMatch) {
                        clonedNode.style.textAlign = alignMatch[1];
                    }
                }
                
                // Xử lý data-indent
                const indent = clonedNode.getAttribute('data-indent');
                if (indent) {
                    clonedNode.style.paddingLeft = `${parseInt(indent) * 20}px`;
                }
                break;
                
            case 'BLOCKQUOTE':
                clonedNode.style.margin = '0';
                clonedNode.style.padding = '0 1.2em';
                clonedNode.style.fontStyle = 'italic';
                clonedNode.style.borderLeft = '4px solid #ddd';
                break;
                
            case 'UL':
            case 'OL':
                clonedNode.style.margin = '6px 0';
                if (clonedNode.tagName === 'UL') {
                    clonedNode.style.listStyleType = 'disc';
                } else {
                    clonedNode.style.listStyleType = 'decimal';
                }
                break;
                
            case 'LI':
                clonedNode.style.margin = '2px 0';
                break;
                
            case 'CODE':
                clonedNode.style.backgroundColor = '#f0f0f0';
                clonedNode.style.padding = '2px 4px';
                clonedNode.style.borderRadius = '3px';
                clonedNode.style.fontFamily = 'monospace';
                break;
        }
        
        // Xử lý các thẻ span với style phức tạp
        if (clonedNode.tagName === 'SPAN') {
            const spanStyle = clonedNode.getAttribute('style') || '';
            if (spanStyle.includes('text-decoration-line')) {
                const decorationMatch = spanStyle.match(/text-decoration-line:\s*([^;]+)/);
                if (decorationMatch) {
                    clonedNode.style.textDecoration = decorationMatch[1];
                }
            }
        }
        
        return clonedNode;
    };

    // Xử lý tất cả các node con
    const children = Array.from(mainContainer.children);
    if (children.length > 0) {
        children.forEach(child => {
            text.appendChild(processNode(child));
        });
    } else {
        // Nếu không có children, thêm nội dung trực tiếp
        text.innerHTML = element.content;
    }

    // Thiết lập các thuộc tính hiển thị chung
    text.style.whiteSpace = 'normal';
    text.style.overflow = 'hidden';
    text.style.display = 'flex';
    text.style.flexDirection = 'column';
    text.style.justifyContent = element.vertical ? 'flex-start' : 'center';

    // Thêm vào slide
    slide.appendChild(text);
}