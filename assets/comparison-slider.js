// Comparison slider with hific-style dragging
const ComparisonSlider = {
    scenes: ['truck', 'counter', 'bonsai', 'flowers', 'barcelona', 'amsterdam', 'bicycle', 'train', 'playroom'],
    methods: {
        'reference': 'Reference',
        'vanilla': 'Original Loss',
        'pixelgs': 'PixelGS',
        'perceptualgs': 'PerceptualGS',
        'wasserstein': 'WD'
    },
    currentScene: 'truck',
    leftMethod: 'wdr',  // Fixed to WD-R
    rightMethod: 'vanilla',

    init() {
        this.createSceneThumbnails();
        this.createMethodTabs();
        this.loadComparison();
        this.setupSlider();
    },

    createSceneThumbnails() {
        const container = document.getElementById('scene-thumbnails');
        this.scenes.forEach(scene => {
            const thumb = document.createElement('div');
            thumb.className = 'scene-thumb' + (scene === this.currentScene ? ' thumb-active' : '');
            thumb.onclick = () => this.selectScene(scene, thumb);

            const img = document.createElement('img');
            img.src = `assets/scenes/${scene}/thumb.png`;
            img.alt = scene;

            const label = document.createElement('div');
            label.className = 'scene-label';
            // Handle numbered variations like "amsterdam2" -> "Amsterdam 2"
            const labelText = scene.replace(/(\d+)$/, ' $1');
            label.textContent = labelText.charAt(0).toUpperCase() + labelText.slice(1);

            thumb.appendChild(img);
            thumb.appendChild(label);
            container.appendChild(thumb);
        });
    },

    createMethodTabs() {
        const rightContainer = document.getElementById('right-method-tabs');

        Object.entries(this.methods).forEach(([key, label], index) => {
            const tab = document.createElement('button');
            tab.className = 'method-tab';
            tab.textContent = label;
            tab.onclick = () => this.selectMethod(key, tab);

            // Add reference-tab class for gradient styling
            if (key === 'reference') {
                tab.classList.add('reference-tab');
            }

            const isActive = (key === this.rightMethod);
            if (isActive) tab.classList.add('active');

            rightContainer.appendChild(tab);
        });
    },

    selectScene(scene, thumbElement) {
        this.currentScene = scene;
        document.querySelectorAll('.scene-thumb').forEach(thumb => thumb.classList.remove('thumb-active'));
        thumbElement.classList.add('thumb-active');
        this.loadComparison();
    },

    selectMethod(method, tabElement) {
        this.rightMethod = method;
        document.querySelectorAll('#right-method-tabs .method-tab').forEach(tab => tab.classList.remove('active'));
        tabElement.classList.add('active');
        this.loadComparison();
    },

    getImagePath(scene, method) {
        const methodMap = {
            'reference': 'reference.png',
            'vanilla': 'method_vanilla.png',
            'pixelgs': 'method_pixelgs.png',
            'perceptualgs': 'method_perceptualgs.png',
            'wasserstein': 'method_wasserstein.png',
            'wdr': 'method_wasserstein+vanilla.png'
        };
        return `assets/scenes/${scene}/${methodMap[method]}`;
    },

    loadComparison() {
        const leftImg = document.getElementById('comparison-left-img');
        const rightImg = document.getElementById('comparison-right-img');

        leftImg.src = this.getImagePath(this.currentScene, this.leftMethod);
        rightImg.src = this.getImagePath(this.currentScene, this.rightMethod);

        // Left label is fixed to "WD-R (Ours)" in HTML
        // Right method is shown by the active tab button
    },

    setupSlider() {
        const dragElement = document.querySelector('.divider');
        const resizeElement = document.querySelector('.resize');
        const container = document.querySelector('.comparison-slider');

        let touched = false;
        window.addEventListener('touchstart', () => { touched = true; });
        window.addEventListener('touchend', () => { touched = false; });

        const startDrag = (e) => {
            e.preventDefault();
            dragElement.classList.add('draggable');
            resizeElement.classList.add('resizable');

            const startX = e.pageX || (e.touches && e.touches[0].pageX);
            const dragWidth = dragElement.offsetWidth;
            const posX = dragElement.getBoundingClientRect().left + dragWidth - startX;
            const containerRect = container.getBoundingClientRect();
            const containerOffset = containerRect.left;
            const containerWidth = containerRect.width;
            const minLeft = 10;
            const maxLeft = containerWidth - dragWidth - 10;

            const onMove = (e) => {
                if (!touched) e.preventDefault();
                const moveX = e.pageX || (e.touches && e.touches[0].pageX);
                let leftValue = moveX + posX - dragWidth - containerOffset;
                leftValue = Math.min(Math.max(leftValue, minLeft), maxLeft);
                const widthValue = ((leftValue + dragWidth / 2) / containerWidth * 100) + "%";

                dragElement.style.left = widthValue;
                resizeElement.style.width = widthValue;
            };

            const onEnd = () => {
                dragElement.classList.remove('draggable');
                resizeElement.classList.remove('resizable');
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onEnd);
                document.removeEventListener('touchmove', onMove);
                document.removeEventListener('touchend', onEnd);
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchmove', onMove);
            document.addEventListener('touchend', onEnd);
        };

        dragElement.addEventListener('mousedown', startDrag);
        dragElement.addEventListener('touchstart', startDrag);
    },

    setupResize() {
        // Handle window resize to recalculate image sizes
        window.addEventListener('resize', () => {
            const leftImg = document.getElementById('comparison-left-img');
            const container = document.querySelector('.comparison-slider');
            const containerWidth = container.offsetWidth;
            leftImg.style.width = (containerWidth * 2) + 'px';
        });
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ComparisonSlider.init());
} else {
    ComparisonSlider.init();
}
