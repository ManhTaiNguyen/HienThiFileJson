export function createTextElement(element, container) {
    const textDiv = document.createElement('div');
    textDiv.className = 'text-element';
    textDiv.style.position = 'absolute';
    textDiv.style.left = `${element.left}px`;
    textDiv.style.top = `${element.top}px`;
    textDiv.style.width = `${element.width}px`;
    textDiv.style.height = `${element.height}px`;
    textDiv.style.boxSizing = 'border-box';

    // Thiết lập font và màu mặc định
    textDiv.style.fontFamily = element.defaultFontName || 'Arial';
    textDiv.style.color = element.defaultColor || '#333';

    // Xử lý các thuộc tính văn bản
    if (element.lineHeight) textDiv.style.lineHeight = String(element.lineHeight);
    if (element.wordSpace) textDiv.style.wordSpacing = `${element.wordSpace}px`;

    // Xử lý text vertical
    if (element.vertical) {
        textDiv.classList.add('text-vertical');
        textDiv.style.writingMode = 'vertical-rl';
        textDiv.style.textOrientation = 'upright';
        textDiv.style.textAlign = 'center';
        textDiv.style.display = 'flex';
        textDiv.style.justifyContent = 'flex-start';
        textDiv.style.alignItems = 'center';
    }

    // Xử lý màu nền
    if (element.fill) {
        textDiv.style.backgroundColor = element.fill;
    }

    // Xử lý outline
    if (element.outline) {
        const { width = 1, style = 'solid', color = '#525252' } = element.outline;
        textDiv.style.border = `${width}px ${style} ${color}`;
    }

    // Xử lý shadow
    if (element.shadow) {
        const { h = 3, v = 3, blur = 2, color = '#808080' } = element.shadow;
        textDiv.style.filter = `drop-shadow(${h}px ${v}px ${blur}px ${color})`;
    }

    // Xử lý xoay
    if (element.rotate) {
        textDiv.style.transform = `rotate(${element.rotate}deg)`;
        textDiv.style.transformOrigin = 'center center';
    }

    // Xử lý nội dung HTML
    const processContent = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Xử lý các thẻ đặc biệt
        const specialTags = {
            'p': (node) => {
                const style = node.getAttribute('style') || '';
                if (style.includes('text-align')) {
                    const align = style.match(/text-align:\s*([^;]+)/)?.[1];
                    if (align) node.style.textAlign = align;
                }
                if (node.hasAttribute('data-indent')) {
                    node.style.paddingLeft = `${parseInt(node.getAttribute('data-indent')) * 20}px`;
                }
                return node;
            },
            'blockquote': (node) => {
                node.style.margin = '0';
                node.style.padding = '0 1.2em';
                node.style.fontStyle = 'italic';
                node.style.borderLeft = '4px solid #ddd';
                return node;
            },
            'ul': (node) => {
                node.style.margin = '6px 0';
                node.style.listStyleType = 'disc';
                return node;
            },
            'ol': (node) => {
                node.style.margin = '6px 0';
                node.style.listStyleType = 'decimal';
                return node;
            },
            'li': (node) => {
                node.style.margin = '2px 0';
                return node;
            },
            'code': (node) => {
                node.style.backgroundColor = '#f0f0f0';
                node.style.padding = '2px 4px';
                node.style.borderRadius = '3px';
                node.style.fontFamily = 'monospace';
                return node;
            },
            'span': (node) => {
                const style = node.getAttribute('style') || '';
                if (style.includes('text-decoration-line')) {
                    const decoration = style.match(/text-decoration-line:\s*([^;]+)/)?.[1];
                    if (decoration) node.style.textDecoration = decoration;
                }
                return node;
            }
        };

        // Clone và xử lý từng node
        const cloneAndProcessNodes = (node) => {
            const clonedNode = node.cloneNode(false);
            
            // Xử lý node hiện tại nếu là thẻ đặc biệt
            const processor = specialTags[clonedNode.tagName.toLowerCase()];
            if (processor) processor(clonedNode);

            // Xử lý các child nodes
            Array.from(node.childNodes).forEach(child => {
                if (child.nodeType === Node.ELEMENT_NODE) {
                    clonedNode.appendChild(cloneAndProcessNodes(child));
                } else if (child.nodeType === Node.TEXT_NODE) {
                    clonedNode.appendChild(child.cloneNode(true));
                }
            });

            return clonedNode;
        };

        return Array.from(tempDiv.childNodes).map(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                return cloneAndProcessNodes(node);
            }
            return node.cloneNode(true);
        });
    };

    // Thêm nội dung đã xử lý vào textDiv
    const processedNodes = processContent(element.content);
    processedNodes.forEach(node => textDiv.appendChild(node));

    // Thiết lập hiển thị chung
    textDiv.style.whiteSpace = 'normal';
    textDiv.style.overflow = 'hidden';
    textDiv.style.display = 'flex';
    textDiv.style.flexDirection = 'column';
    textDiv.style.justifyContent = element.vertical ? 'flex-start' : 'center';

    // Thêm vào container
    container.appendChild(textDiv);
}