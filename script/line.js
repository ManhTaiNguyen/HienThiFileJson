export function drawLine(element, slide) {
    const lineContainer = document.createElement('div');
    lineContainer.className = 'svg-line-container';
    lineContainer.style.position = 'absolute';
    lineContainer.style.left = `${element.left}px`;
    lineContainer.style.top = `${element.top}px`;
    lineContainer.style.width = '100%';
    lineContainer.style.height = '100%';

    // bóng của đường kẻ
    if (element.shadow) {
        lineContainer.style.filter = 'none'; // Reset filter trước
        const shadow = element.shadow;
        lineContainer.style.filter = `drop-shadow(${shadow.h || 0}px ${shadow.v || 0}px ${shadow.blur || 0}px ${shadow.color || '#000'})`;
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.overflow = 'visible';
    
    // Tạo defs cho các marker
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);

    // Kích thước mũi tên dựa trên độ rộng đường kẻ
    const arrowSize = Math.min(3, (element.width || 2) * 2);            
    const arrowWidth = arrowSize;
    const arrowHeight = arrowSize;

    // Tạo marker cho mũi tên (đầu bắt đầu)
    let arrowStartMarkerId = null;
    if (element.points && element.points[0] === 'arrow') {
        arrowStartMarkerId = `arrowhead-start-${Math.random().toString(36).substr(2, 9)}`;
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', arrowStartMarkerId);
        marker.setAttribute('markerWidth', arrowWidth);
        marker.setAttribute('markerHeight', arrowHeight);
        marker.setAttribute('refX', arrowWidth * 0.5); // Điều chỉnh vị trí đầu mũi tên
        marker.setAttribute('refY', arrowHeight / 2);
        marker.setAttribute('orient', 'auto-start-reverse');
        marker.setAttribute('markerUnits', 'strokeWidth');
        
        const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrowPath.setAttribute('d', `M0,0 L${arrowWidth},${arrowHeight/2} L0,${arrowHeight} Z`);
        arrowPath.setAttribute('fill', element.color || '#5b9bd5');
        marker.appendChild(arrowPath);
        defs.appendChild(marker);
    }
    
    // Tạo marker cho mũi tên (đầu cuối)
    let arrowEndMarkerId = null;
    if (element.points && element.points[1] === 'arrow') {
        arrowEndMarkerId = `arrowhead-end-${Math.random().toString(36).substr(2, 9)}`;
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
        marker.setAttribute('id', arrowEndMarkerId);
        marker.setAttribute('markerWidth', arrowWidth);
        marker.setAttribute('markerHeight', arrowHeight);
        marker.setAttribute('refX', arrowWidth * 0.1);
        marker.setAttribute('refY', arrowHeight / 2);
        marker.setAttribute('orient', 'auto');
        marker.setAttribute('markerUnits', 'strokeWidth');
        
        const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrowPath.setAttribute('d', `M0,0 L${arrowWidth},${arrowHeight/2} L0,${arrowHeight} Z`);
        arrowPath.setAttribute('fill', element.color || '#5b9bd5');
        marker.appendChild(arrowPath);
        defs.appendChild(marker);
    }

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Xác định dạng đường kẻ
    let pathData = '';
    if (element.cubic) {
        pathData = `M${element.start?.[0] || 0} ${element.start?.[1] || 0} 
                C${element.cubic[0][0]} ${element.cubic[0][1]} 
                ${element.cubic[1][0]} ${element.cubic[1][1]} 
                ${element.end[0]} ${element.end[1]}`;
    } else if (element.curve) {
        pathData = `M${element.start?.[0] || 0} ${element.start?.[1] || 0} 
                Q${element.curve[0]} ${element.curve[1]} 
                ${element.end[0]} ${element.end[1]}`;
    } else if (element.broken) {
        // Đường gấp khúc
        pathData = `M${element.start?.[0] || 0} ${element.start?.[1] || 0} 
                L${element.broken[0]} ${element.broken[1]} 
                L${element.end[0]} ${element.end[1]}`;
    } else {
        // Đường thẳng
        pathData = `M${element.start?.[0] || 0} ${element.start?.[1] || 0} 
                L${element.end[0]} ${element.end[1]}`;
    }
    
    line.setAttribute('d', pathData);
    line.setAttribute('stroke', element.color || '#5b9bd5');
    line.setAttribute('stroke-width', element.width || 2);
    line.setAttribute('vector-effect', 'non-scaling-stroke');
    line.setAttribute('stroke-miterlimit', '4');
    line.setAttribute('fill', 'none');
    
    // Xử lý các kiểu đường kẻ
    if (element.style) {
        switch(element.style.toLowerCase()) {
            case 'dashed':
                const dashLength = Math.max(3, element.width || 2) * 3.5;
                const gapLength = Math.max(2, element.width || 2) * 2.5;
                line.setAttribute('stroke-dasharray', `${dashLength},${gapLength}`);
                line.setAttribute('stroke-linecap', 'round');
                break;
            case 'custom':
                if (element.dashArray) {
                    line.setAttribute('stroke-dasharray', element.dashArray);
                }
                break;
            case 'double':
                // Tạo hiệu ứng đường kép
                line.setAttribute('stroke', 'transparent');
                line.setAttribute('stroke-width', (element.width || 2) * 3);
                
                const innerLine = line.cloneNode();
                innerLine.setAttribute('stroke', element.color || '#5b9bd5');
                innerLine.setAttribute('stroke-width', element.width || 2);
                innerLine.setAttribute('vector-effect', 'non-scaling-stroke');
                svg.appendChild(innerLine);
                break;
        }
    }

    // Xử lý chấm ở điểm đầu và cuối
    const dotRadius = (element.width || 2) * 1.5;
    const dotColor = element.color || '#5b9bd5';
    
    // Xử lý điểm đầu và điểm cuối
    if (element.points) {
        if (element.points[0] === 'arrow' && arrowStartMarkerId) {
            line.setAttribute('marker-start', `url(#${arrowStartMarkerId})`);
        }
        if (element.points[1] === 'arrow' && arrowEndMarkerId) {
            line.setAttribute('marker-end', `url(#${arrowEndMarkerId})`);
        }
    }

    // Điểm bắt đầu
    if (element.start && element.points && element.points[0] === 'dot') {
        const startDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        startDot.setAttribute('cx', element.start[0]);
        startDot.setAttribute('cy', element.start[1]);
        startDot.setAttribute('r', dotRadius);
        startDot.setAttribute('fill', dotColor);
        svg.appendChild(startDot);
    }
    
    // Điểm kết thúc
    if (element.end && element.points && element.points[1] === 'dot') {
        const endDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        endDot.setAttribute('cx', element.end[0]);
        endDot.setAttribute('cy', element.end[1]);
        endDot.setAttribute('r', dotRadius);
        endDot.setAttribute('fill', dotColor);
        svg.appendChild(endDot);
    }
    
    // Điểm gấp khúc (nếu có)
    if (element.broken && element.brokenPoint === 'dot') {
        const brokenDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        brokenDot.setAttribute('cx', element.broken[0]);
        brokenDot.setAttribute('cy', element.broken[1]);
        brokenDot.setAttribute('r', dotRadius);
        brokenDot.setAttribute('fill', dotColor);
        svg.appendChild(brokenDot);
    }
    
    svg.appendChild(line);
    lineContainer.appendChild(svg);
    slide.appendChild(lineContainer);
}