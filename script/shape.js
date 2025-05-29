export function drawShape(element, container) {
    const shape = document.createElement('div');
    shape.className = 'shape';

    // Thêm shadow nếu có
    if (element.shadow) {
        const shadow = element.shadow;
        shape.classList.add('shape-with-shadow');
        let h = shadow.h || 0;
        let v = shadow.v || 0;
        shape.style.setProperty('--shadow-h', `${h}px`);
        shape.style.setProperty('--shadow-v', `${v}px`);
        shape.style.setProperty('--shadow-blur', `${shadow.blur || 0}px`);
        shape.style.setProperty('--shadow-color', `${shadow.color || 'rgba(0,0,0,0.5)'}`);
    }

    // Vị trí và kích thước
    shape.style.position = 'absolute';
    shape.style.left = `${element.left}px`;
    shape.style.top = `${element.top}px`;
    shape.style.width = `${element.width}px`;
    shape.style.height = `${element.height}px`;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', element.width);
    svg.setAttribute('height', element.height);
    svg.setAttribute('viewBox', `0 0 ${element.viewBox?.[0] || element.width} ${element.viewBox?.[1] || element.height}`);
    svg.setAttribute('preserveAspectRatio', 'none');

    // Tạo path chính
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', element.path || 'M0,0 L100,0 L50,100 Z');

    // Tạo gradient nếu có
    if (element.gradient) {
        const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        
        let gradient;
        if (element.gradient.type === 'radial') {
            // Tạo gradient xuyên tâm
            gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
            gradient.setAttribute('id', gradientId);
            gradient.setAttribute('cx', element.gradient.cx || '50%');
            gradient.setAttribute('cy', element.gradient.cy || '50%');
            gradient.setAttribute('r', element.gradient.r || '50%');
            gradient.setAttribute('fx', element.gradient.fx || element.gradient.cx || '50%');
            gradient.setAttribute('fy', element.gradient.fy || element.gradient.cy || '50%');
        } else {
            // Mặc định là gradient tuyến tính
            gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradient.setAttribute('id', gradientId);
            gradient.setAttribute('gradientTransform', `rotate(${element.gradient.rotate || 0})`);
        }

        // Xử lý màu gradient
        if (element.gradient.color && Array.isArray(element.gradient.color)) {
            const colors = element.gradient.color;
            const step = 100 / (colors.length - 1);
            colors.forEach((color, index) => {
                const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stopElement.setAttribute('offset', `${index * step}%`);
                stopElement.setAttribute('stop-color', color);
                gradient.appendChild(stopElement);
            });
        }

        defs.appendChild(gradient);
        svg.appendChild(defs);
        path.setAttribute('fill', `url(#${gradientId})`);
    } else if (element.fill) {
        path.setAttribute('fill', element.fill);
    } else {
        path.setAttribute('fill', 'transparent');
    }

    // Xử lý opacity
    path.setAttribute('opacity', element.opacity !== undefined ? element.opacity : 1);

    // Xử lý outline/border
    if (element.outline) {
        path.setAttribute('stroke', element.outline.color || '#000000');
        path.setAttribute('stroke-width', element.outline.width || 1);
        path.setAttribute('vector-effect', 'non-scaling-stroke');
        
        if (element.outline.style === 'dashed') {
            path.setAttribute('stroke-dasharray', '5,3');
        } else if (element.outline.style === 'dotted') {
            path.setAttribute('stroke-dasharray', '1,3');
        }
    }

    svg.appendChild(path);

    // Xử lý transform
    let transform = '';
    if (element.flipH) transform += ' scaleX(-1)';
    if (element.flipV) transform += ' scaleY(-1)';
    if (element.rotate) transform += ` rotate(${element.rotate}deg)`;
    
    if (transform) {
        shape.style.transform = transform.trim();
        shape.style.transformOrigin = 'center';
        shape.style.backfaceVisibility = 'visible';
        shape.style.willChange = 'transform';
    }

    shape.appendChild(svg);

    // Thêm text nếu có
    if (element.text && element.text.content) {
        const textContainer = document.createElement('div');
        textContainer.className = 'shape-text-container';
        textContainer.style.position = 'absolute';
        textContainer.style.width = '100%';
        textContainer.style.height = '100%';
        textContainer.style.display = 'flex';
        
        // Căn chỉnh text dựa trên thuộc tính align
        const align = element.text.align || 'middle';
        switch(align) {
            case 'left':
                textContainer.style.justifyContent = 'flex-start';
                break;
            case 'right':
                textContainer.style.justifyContent = 'flex-end';
                break;
            case 'middle' :
            case 'center' :
            default:
                textContainer.style.justifyContent = 'center';
        }
        textContainer.style.alignItems = 'center';

        // Áp dụng opacity cho text container
        if (element.opacity !== undefined) {
            textContainer.style.opacity = element.opacity;
        }

        // Áp dụng flip cho text container
        let textTransform = '';
        if (element.rotate) textTransform += ` rotate(${element.rotate}deg)`;
        if (textTransform) {
            textContainer.style.transform = textTransform.trim();
        }

        const textDiv = document.createElement('div');
        textDiv.className = 'shape-text';
        textDiv.innerHTML = element.text.content;

        // Áp dụng font và màu mặc định
        if (element.text.defaultFontName) {
            textDiv.style.fontFamily = element.text.defaultFontName;
        }
        if (element.text.defaultColor) {
            textDiv.style.color = element.text.defaultColor;
        }

        textContainer.appendChild(textDiv);
        shape.appendChild(textContainer);
    }

    container.appendChild(shape);
}