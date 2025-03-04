// 卡片数据
const cardData = [
    {
        title: 'MAGNA',
        subtitle: 'COASTAL',
        description: 'An undiscovered coastal jewel on the Gulf of Aqaba near the Red Sea. Magna will be a place like nothing on earth.',
        buttonText: 'Invest in Future',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300',
        color: '#1a1a1a'
    },
    {
        title: 'NEOM',
        subtitle: 'THE LINE',
        description: 'A revolution in urban living. A city that delivers new possibilities, fostering innovation and prosperity.',
        buttonText: 'Discover More',
        imageUrl: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=300',
        color: '#2a2a2a'
    },
    {
        title: 'TROJENA',
        subtitle: 'MOUNTAIN',
        description: 'A unique year-round mountain destination blending natural landscapes with exceptional experiences.',
        buttonText: 'Explore Now',
        imageUrl: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=300',
        color: '#3a3a3a'
    },
    {
        title: 'OXAGON',
        subtitle: 'INDUSTRIAL',
        description: "The world's largest floating industrial complex, reimagining manufacturing and global supply chains.",
        buttonText: 'Learn More',
        imageUrl: 'https://images.unsplash.com/photo-1526749837599-b4eba9fd855e?w=300',
        color: '#2d2d2d'
    },
    {
        title: 'SINDALAH',
        subtitle: 'ISLAND',
        description: 'A luxury island destination offering exceptional nautical experiences in the Red Sea.',
        buttonText: 'Visit Soon',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300',
        color: '#252525'
    }
];

// 初始化变量
let cardsContainer;
let cards = [];
let startY, startX;
let activeCardIndex = 0;
let isDragging = false;
let currentY, currentX;
let initialY, initialX;
let yOffset = 0;
let xOffset = 0;
let direction = null; // 'up', 'down', 'left', 'right'
let lastCardIndex = -1; // 记录上一张卡片的索引
const CARD_SPACING = 25; // 增加卡片之间的间距
const THRESHOLD = 150; // 卡片消失的阈值
const VISIBLE_CARDS = 3; // 同时可见的卡片数量
const ROTATION_ANGLE = 7; // 增加旋转角度

// 颜色提取函数 - 模拟从图片中提取主色调
function extractDominantColor(index) {
    // 在实际应用中，你可以使用Color Thief等库从图片中提取颜色
    // 这里我们简单地使用预设的颜色
    return cardData[index % cardData.length].color;
}

// 创建卡片元素
function createCardElement(data, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.zIndex = 1000 - index;
    card.style.transform = `translateY(${index * CARD_SPACING}px) scale(${1 - index * 0.05}) rotate(${index * 2}deg)`;
    card.style.opacity = 1 - index * 0.15;
    
    // 提取主色调并应用到卡片背景和阴影
    const dominantColor = data.color;
    card.style.backgroundColor = dominantColor;
    card.style.boxShadow = `0 10px 50px ${dominantColor}aa, 0 30px 100px ${dominantColor}55`;
    
    // 添加卡片边缘微妙的光晕效果，增强高级感
    card.style.border = `1px solid ${dominantColor}33`;
    card.style.backdropFilter = 'blur(10px)';
    card.style.webkitBackdropFilter = 'blur(10px)';
    
    // 卡片内容
    card.innerHTML = `
        <div class="card-icons">
            <div class="card-icon">🏨</div>
        </div>
        <div class="expand-icon">↗</div>
        <img class="card-image" src="${data.imageUrl}" alt="${data.title}">
        <div class="card-content">
            <div>
                <h2 class="card-title">${data.title}</h2>
                <h3 class="card-subtitle">${data.subtitle}</h3>
                <p class="card-description">${data.description}</p>
            </div>
            <a href="#" class="card-button">$ ${data.buttonText}</a>
        </div>
    `;
    
    return card;
}

// 更新背景图片
function updateBackgroundImage(imageUrl) {
    const backgroundImage = document.querySelector('.background-image');
    backgroundImage.style.backgroundImage = `url(${imageUrl})`;
}

// 初始化卡片
function initializeCards() {
    cardsContainer = document.querySelector('.cards-container');
    
    // 清空容器
    cardsContainer.innerHTML = '';
    cards = [];
    
    // 创建初始卡片
    for (let i = 0; i < VISIBLE_CARDS; i++) {
        const cardIndex = i % cardData.length;
        const card = createCardElement(cardData[cardIndex], i);
        cardsContainer.appendChild(card);
        cards.push(card);
        
        // 只为顶部卡片添加事件监听器
        if (i === 0) {
            addEventListeners(card);
            // 设置初始背景图片
            updateBackgroundImage(cardData[cardIndex].imageUrl);
        }
    }
}

// 添加事件监听器
function addEventListeners(card) {
    card.addEventListener('mousedown', dragStart);
    card.addEventListener('touchstart', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
}

// 拖动开始
function dragStart(e) {
    if (e.type === 'touchstart') {
        initialY = e.touches[0].clientY;
        initialX = e.touches[0].clientX;
    } else {
        initialY = e.clientY;
        initialX = e.clientX;
    }
    
    activeCardIndex = 0; // 顶部卡片
    isDragging = true;
    cards[activeCardIndex].classList.add('active');
    
    // 记录起始位置
    startY = initialY;
    startX = initialX;
    currentY = initialY;
    currentX = initialX;
    yOffset = 0;
    xOffset = 0;
    direction = null;
}

// 拖动中
function drag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    
    if (e.type === 'touchmove') {
        currentY = e.touches[0].clientY;
        currentX = e.touches[0].clientX;
    } else {
        currentY = e.clientY;
        currentX = e.clientX;
    }
    
    // 计算拖动距离
    yOffset = currentY - initialY;
    xOffset = currentX - initialX;
    
    // 确定是否开始拖动（不再限制方向）
    if (!direction && (Math.abs(xOffset) > 10 || Math.abs(yOffset) > 10)) {
        direction = 'any'; // 使用'any'表示任意方向
    }
    
    // 应用变换 - 支持任意方向
    if (direction) {
        // 直接使用x和y的偏移量
        const translateX = xOffset;
        const translateY = yOffset;
        
        // 计算旋转角度 - 基于拖动方向
        // 使用反正切函数计算拖动角度
        const dragAngle = Math.atan2(yOffset, xOffset);
        const dragDistance = Math.sqrt(xOffset * xOffset + yOffset * yOffset);
        const rotateDirection = Math.sign(Math.cos(dragAngle) + Math.sin(dragAngle));
        const rotate = rotateDirection * ROTATION_ANGLE * Math.min(dragDistance / THRESHOLD, 1);
        
        cards[activeCardIndex].style.transition = 'none';
        cards[activeCardIndex].style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`;
        
        // 根据拖动距离调整其他卡片的位置
        // 使用总的拖动距离来更新卡片位置
        updateCardPositions(Math.sqrt(xOffset * xOffset + yOffset * yOffset));
    }
}

// 拖动结束
function dragEnd() {
    if (!isDragging) return;
    
    isDragging = false;
    initialY = currentY;
    initialX = currentX;
    
    // 计算总的拖动距离（不再区分方向）
    const dragDistance = Math.sqrt(xOffset * xOffset + yOffset * yOffset);
    
    // 检查是否超过阈值
    if (dragDistance > THRESHOLD) {
        // 计算拖动的主要方向角度
        const dragAngle = Math.atan2(yOffset, xOffset);
        
        // 将角度转换为0-360度
        let degrees = dragAngle * (180 / Math.PI);
        if (degrees < 0) degrees += 360;
        
        // 判断是前进还是后退（右半圆为前进，左半圆为后退）
        const isForward = (degrees >= 315 || degrees < 135);
        
        if (isForward) {
            // 向前滑动 - 显示下一张卡片
            lastCardIndex = activeCardIndex;
            const removedCard = cards.shift();
            removedCard.style.transition = 'all 0.5s ease';
            
            // 根据角度决定卡片消失的方向
            const exitX = Math.cos(dragAngle) * window.innerWidth * 1.5;
            const exitY = Math.sin(dragAngle) * window.innerHeight * 1.5;
            const rotateAmount = Math.sign(Math.cos(dragAngle) + Math.sin(dragAngle)) * ROTATION_ANGLE;
            
            removedCard.style.transform = `translate(${exitX}px, ${exitY}px) rotate(${rotateAmount}deg)`;
            removedCard.style.opacity = '0';
            
            setTimeout(() => {
                removedCard.remove();
            }, 500);
            
            // 添加新卡片到底部
            addNewCard();
        } else {
            // 向后滑动 - 显示上一张卡片
            const currentIndex = parseInt(cards[0].dataset.index || '0');
            const prevIndex = (currentIndex - 1 + cardData.length) % cardData.length;
            
            // 移除当前卡片
            const removedCard = cards.shift();
            removedCard.style.transition = 'all 0.5s ease';
            
            // 根据角度决定卡片消失的方向
            const exitX = Math.cos(dragAngle) * window.innerWidth * 1.5;
            const exitY = Math.sin(dragAngle) * window.innerHeight * 1.5;
            const rotateAmount = Math.sign(Math.cos(dragAngle) + Math.sin(dragAngle)) * ROTATION_ANGLE;
            
            removedCard.style.transform = `translate(${exitX}px, ${exitY}px) rotate(${rotateAmount}deg)`;
            removedCard.style.opacity = '0';
            
            setTimeout(() => {
                removedCard.remove();
            }, 500);
            
            // 添加上一张卡片到顶部
            addPrevCard(prevIndex);
        }
        
        // 更新所有卡片的位置
        resetCardPositions();
    } else {
        // 未超过阈值，恢复原位
        cards[activeCardIndex].style.transition = 'transform 0.5s ease';
        cards[activeCardIndex].style.transform = `translateY(0) scale(1) rotate(0deg)`;
        cards[activeCardIndex].classList.remove('active');
        
        // 恢复其他卡片位置
        resetCardPositions();
    }
    
    direction = null;
}

// 设置卡片位置
function setTranslate(xPos, yPos, element, rotate = 0) {
    element.style.transition = 'none';
    element.style.transform = `translate(${xPos}px, ${yPos}px) scale(1) rotate(${rotate}deg)`;
}

// 更新卡片位置
function updateCardPositions(offset) {
    // 根据顶部卡片的拖动距离，调整其他卡片的位置
    const progress = Math.min(offset / THRESHOLD, 1);
    
    for (let i = 1; i < cards.length; i++) {
        const card = cards[i];
        const initialOffset = i * CARD_SPACING;
        const targetOffset = (i - 1) * CARD_SPACING;
        const currentOffset = initialOffset - (initialOffset - targetOffset) * progress;
        
        const initialScale = 1 - i * 0.05;
        const targetScale = 1 - (i - 1) * 0.05;
        const currentScale = initialScale + (targetScale - initialScale) * progress;
        
        const initialOpacity = 1 - i * 0.15;
        const targetOpacity = 1 - (i - 1) * 0.15;
        const currentOpacity = initialOpacity + (targetOpacity - initialOpacity) * progress;
        
        const initialRotation = i * 2;
        const targetRotation = (i - 1) * 2;
        const currentRotation = initialRotation + (targetRotation - initialRotation) * progress;
        
        card.style.transition = 'none';
        card.style.transform = `translateY(${currentOffset}px) scale(${currentScale}) rotate(${currentRotation}deg)`;
        card.style.opacity = currentOpacity;
        card.style.zIndex = 1000 - i;
    }
}

// 重置卡片位置
function resetCardPositions() {
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        card.style.transform = `translateY(${i * CARD_SPACING}px) scale(${1 - i * 0.05}) rotate(${i * 2}deg)`;
        card.style.opacity = 1 - i * 0.15;
        card.style.zIndex = 1000 - i;
        
        // 只为顶部卡片添加事件监听器
        if (i === 0) {
            card.classList.remove('active');
            // 确保顶部卡片有事件监听器
            card.addEventListener('mousedown', dragStart);
            card.addEventListener('touchstart', dragStart);
        }
    }
}

// 添加新卡片
function addNewCard() {
    const newIndex = cards.length;
    const dataIndex = (newIndex + activeCardIndex) % cardData.length;
    const newCard = createCardElement(cardData[dataIndex], VISIBLE_CARDS - 1);
    
    // 设置初始位置在底部且不可见
    newCard.style.transform = `translateY(${(VISIBLE_CARDS - 1) * CARD_SPACING}px) scale(${1 - (VISIBLE_CARDS - 1) * 0.05}) rotate(${(VISIBLE_CARDS - 1) * 2}deg)`;
    newCard.style.opacity = '0';
    newCard.style.zIndex = 1000 - (VISIBLE_CARDS - 1);
    newCard.dataset.index = dataIndex.toString();
    
    cardsContainer.appendChild(newCard);
    cards.push(newCard);
    
    // 更新背景图片
    updateBackgroundImage(cardData[dataIndex].imageUrl);
    
    // 延迟一帧使过渡生效
    setTimeout(() => {
        newCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        newCard.style.opacity = 1 - (VISIBLE_CARDS - 1) * 0.15;
    }, 50);
}

// 添加上一张卡片
function addPrevCard() {
    // 计算上一张卡片的索引
    const currentIndex = parseInt(cards[0].dataset.index || '0');
    const prevIndex = (currentIndex - 1 + cardData.length) % cardData.length;
    
    // 创建上一张卡片
    const prevCard = createCardElement(cardData[prevIndex], 0);
    prevCard.dataset.index = prevIndex.toString();
    
    // 更新背景图片
    updateBackgroundImage(cardData[prevIndex].imageUrl);
    
    // 设置初始位置在顶部且不可见
    prevCard.style.transform = `translateY(-100px) scale(1) rotate(-${ROTATION_ANGLE}deg)`;
    prevCard.style.opacity = '0';
    prevCard.style.zIndex = 1001;
    
    // 添加到容器顶部
    cardsContainer.prepend(prevCard);
    cards.unshift(prevCard);
    
    // 如果卡片数量超过可见数量，移除最后一张
    if (cards.length > VISIBLE_CARDS) {
        const lastCard = cards.pop();
        lastCard.remove();
    }
    
    // 延迟一帧使过渡生效
    setTimeout(() => {
        prevCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        prevCard.style.opacity = '1';
        resetCardPositions();
    }, 50);
    
    // 为新卡片添加事件监听器
    addEventListeners(prevCard);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializeCards);