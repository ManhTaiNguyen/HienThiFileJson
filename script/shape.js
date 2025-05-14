export function drawShape(element, slide) {
    const shape = document.createElement('div');
    shape.className = 'shape';

    // Thêm shadow nếu có
    if (element.shadow) {
        const shadow = element.shadow;
        shape.classList.add('shape-with-shadow');
        let h = shadow.h || 0;
        let v = shadow.v || 0;

        if (element.flipH) h = -h;
        if (element.flipV) v = -v;

        shape.style.setProperty('--shadow-h', `${h}px`);
        shape.style.setProperty('--shadow-v', `${v}px`);
        shape.style.setProperty('--shadow-blur', `${shadow.blur || 0}px`);
        shape.style.setProperty('--shadow-color', `${shadow.color || 'rgba(0,0,0,0.5)'}`);
    }

    // Xử lý outline, border
    const outline = element.outline || {};
    const borderWidth = outline.width || element.borderWidth || 0;
    const borderColor = outline.color || element.borderColor || '#000000';
    const borderStyle = outline.style || element.borderStyle || 'solid';

    // Vị trí và kích thước
    const width = element.width || 100;
    const height = element.height || 100;

    // Đặt transform origin vào giữa hình
    shape.style.transformOrigin = 'center center';

    shape.style.left = `${element.left}px`;
    shape.style.top = `${element.top}px`;
    shape.style.width = `${element.width}px`;
    shape.style.height = `${element.height}px`;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${element.viewBox?.[0] || width} ${element.viewBox?.[1] || height}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    
    // Tạo gradient nếu có
    let gradientId = null;
    if (element.fill && element.fill.type === 'gradient') {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
        
        let gradient;
        if (element.fill.gradient.type === 'linear') {
            gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradient.setAttribute('id', gradientId);
            gradient.setAttribute('x1', element.fill.gradient.x1 || '0%');
            gradient.setAttribute('y1', element.fill.gradient.y1 || '0%');
            gradient.setAttribute('x2', element.fill.gradient.x2 || '100%');
            gradient.setAttribute('y2', element.fill.gradient.y2 || '0%');
            
            // Thêm góc xoay cho gradient nếu có
            if (element.fill.gradient.rotate) {
                gradient.setAttribute('gradientTransform', `rotate(${element.fill.gradient.rotate})`);
            }
        } 
        else if (element.fill.gradient.type === 'radial') {
            gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
            gradient.setAttribute('id', gradientId);
            gradient.setAttribute('cx', element.fill.gradient.cx || '50%');
            gradient.setAttribute('cy', element.fill.gradient.cy || '50%');
            gradient.setAttribute('r', element.fill.gradient.r || '50%');
            gradient.setAttribute('fx', element.fill.gradient.fx || element.fill.gradient.cx || '50%');
            gradient.setAttribute('fy', element.fill.gradient.fy || element.fill.gradient.cy || '50%');
        }
        
        // Xử lý các điểm dừng màu
        if (element.fill.gradient.stops && element.fill.gradient.stops.length > 0) {
            element.fill.gradient.stops.forEach(stop => {
                const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stopElement.setAttribute('offset', stop.offset || '0%');
                stopElement.setAttribute('stop-color', stop.color || '#ffffff');
                if (stop.opacity !== undefined) {
                    stopElement.setAttribute('stop-opacity', stop.opacity);
                }
                gradient.appendChild(stopElement);
            });
        } else if (element.fill.gradient.color && Array.isArray(element.fill.gradient.color)) {
            // Hỗ trợ định dạng gradient đơn giản với mảng màu
            const colors = element.fill.gradient.color;
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
    }
    
    let svgElement;
    if (element.shapeType) {
        switch (element.shapeType.toLowerCase()) {
            case 'rectangle':
            case 'rect':
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', '0');
                rect.setAttribute('y', '0');
                rect.setAttribute('width', '100%');
                rect.setAttribute('height', '100%');
                svgElement = rect;
                if (element.rx) rect.setAttribute('rx', element.rx);
                if (element.ry) rect.setAttribute('ry', element.ry);
                break;
                
            case 'circle':
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', '50%');
                circle.setAttribute('cy', '50%');
                circle.setAttribute('r', '50%');
                svgElement = circle;
                break;
                
            case 'ellipse':
                const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
                ellipse.setAttribute('cx', '50%');
                ellipse.setAttribute('cy', '50%');
                ellipse.setAttribute('rx', '50%');
                ellipse.setAttribute('ry', '30%');
                svgElement = ellipse;
                break;
                
            case 'polygon':
                const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                const points = element.points || '0,0 100,0 50,100';
                polygon.setAttribute('points', points);
                svgElement = polygon;
                break;
                
            case 'line':
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', element.x1 || '0');
                line.setAttribute('y1', element.y1 || '0');
                line.setAttribute('x2', element.x2 || '100%');
                line.setAttribute('y2', element.y2 || '100%');
                line.setAttribute('stroke', element.stroke || '#5b9bd5');
                line.setAttribute('stroke-width', element.strokeWidth || 2);
                line.setAttribute('opacity', element.opacity || 1);
                svgElement = line;
                break;
                
            default:
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', element.path || 'M0,0 L100,0 L50,100 Z');
                svgElement = path;
        }
    } else {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', element.path || 'M0,0 L100,0 L50,100 Z');
        svgElement = path;
    }

    if (element.gradient) {
        // Hỗ trợ cả gradient đặt ở root và trong fill
        const gradientData = element.gradient || (element.fill && element.fill.gradient);
        
        if (gradientData) {
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
            
            let gradient;
            if (gradientData.type === 'linear') {
                gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
                gradient.setAttribute('id', gradientId);
                gradient.setAttribute('x1', gradientData.x1 || '0%');
                gradient.setAttribute('y1', gradientData.y1 || '0%');
                gradient.setAttribute('x2', gradientData.x2 || '100%');
                gradient.setAttribute('y2', gradientData.y2 || '0%');
                
                if (gradientData.rotate) {
                    gradient.setAttribute('gradientTransform', `rotate(${gradientData.rotate})`);
                }
            } 
            else if (gradientData.type === 'radial') {
                gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
                gradient.setAttribute('id', gradientId);
                gradient.setAttribute('cx', gradientData.cx || '50%');
                gradient.setAttribute('cy', gradientData.cy || '50%');
                gradient.setAttribute('r', gradientData.r || '50%');
                gradient.setAttribute('fx', gradientData.fx || gradientData.cx || '50%');
                gradient.setAttribute('fy', gradientData.fy || gradientData.cy || '50%');
            }
            
            if (gradientData.stops && gradientData.stops.length > 0) {
                gradientData.stops.forEach(stop => {
                    const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                    stopElement.setAttribute('offset', stop.offset || '0%');
                    stopElement.setAttribute('stop-color', stop.color || '#ffffff');
                    if (stop.opacity !== undefined) {
                        stopElement.setAttribute('stop-opacity', stop.opacity);
                    }
                    gradient.appendChild(stopElement);
                });
            } 
            else if (gradientData.color && Array.isArray(gradientData.color)) {
                // Hỗ trợ định dạng gradient đơn giản với mảng màu
                const colors = gradientData.color;
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
            svgElement.setAttribute('fill', `url(#${gradientId})`);
        }
    } 
    else if (element.fill) {
        // Xử lý fill đơn sắc nếu không có gradient
        svgElement.setAttribute('fill', typeof element.fill === 'object' ? element.fill.color : element.fill);
    }
    
    svgElement.setAttribute('opacity', element.opacity || 1);
    
    // Xử lý đường viền
    if (borderWidth > 0) {
        svgElement.setAttribute('stroke', borderColor);
        svgElement.setAttribute('stroke-width', borderWidth);
        svgElement.setAttribute('vector-effect', 'non-scaling-stroke');
        svgElement.setAttribute('stroke-miterlimit', '4');
        
        // Xử lý kiểu đường viền
        switch(borderStyle.toLowerCase()) {
            case 'dashed':
                svgElement.setAttribute('stroke-dasharray', `${borderWidth * 3},${borderWidth * 2}`);
                svgElement.setAttribute('stroke-linecap', 'round');
                break;
            case 'dotted':
                svgElement.setAttribute('stroke-dasharray', `0,${borderWidth * 2}`);
                svgElement.setAttribute('stroke-linecap', 'round');
                break;
            case 'double':
                svgElement.setAttribute('stroke-dasharray', `${borderWidth},${borderWidth}`);
                svgElement.setAttribute('stroke-dashoffset', borderWidth/2);
                break;
            default:
                svgElement.setAttribute('stroke-linecap', 'butt');
        }
    }
    
    svg.appendChild(svgElement);
    
    // Áp dụng transform cho cả SVG và shape container nếu cần
    let svgTransform = '';
    let shapeTransform = '';

    // Xử lý flip và rotate
    if (element.flipV) {
        svgTransform += ' scale(1,-1)';
    }
    if (element.flipH) {
        svgTransform += ' scale(-1,1)';
    }
    if (element.rotate) {
        // Áp dụng rotate cho shape container để giữ nguyên vị trí
        shapeTransform += ` rotate(${element.rotate}deg)`;
        shape.style.transformOrigin = 'center center';
    }
    
    if (svgTransform) {
        svg.setAttribute('transform', svgTransform.trim());
    }
    if (shapeTransform) {
        shape.style.transform = shapeTransform.trim();
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
            case 'middle':
            case 'center':
            default:
                textContainer.style.justifyContent = 'center';
        }
        textContainer.style.alignItems = 'center';

        if (element.opacity !== undefined) {
            textContainer.style.opacity = element.opacity;
        }

        // Áp dụng flip cho text container nếu cần
        let textTransform = '';
        if (element.flipV) {
            textTransform += ' scaleY(-1)';
        }
        if (element.flipH) {
            textTransform += ' scaleX(-1)';
        }
        if (textTransform) {
            textContainer.style.transform = textTransform.trim();
        }
        
        const textDiv = document.createElement('div');
        textDiv.className = 'shape-text';
        
        // Áp dụng các thuộc tính văn bản
        if (element.text.defaultFontName) {
            textDiv.style.fontFamily = element.text.defaultFontName;
        }

        if (element.text.defaultColor) {
            textDiv.style.color = element.text.defaultColor;
        }
        
        // Xử lý nội dung HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = element.text.content;
        const paragraphs = tempDiv.querySelectorAll('p');
        
        if (paragraphs.length > 0) {
            paragraphs.forEach(p => {
                const style = p.getAttribute('style');
                if (style && style.includes('text-align')) {
                    p.style.textAlign = style.match(/text-align:\s*([^;]+)/)[1];
                }
                textDiv.appendChild(p.cloneNode(true));
            });
        } else {
            textDiv.innerHTML = element.text.content;
        }
        
        textContainer.appendChild(textDiv);
        shape.appendChild(textContainer);
    }
    
    slide.appendChild(shape);
}