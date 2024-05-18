type TargetObservedElement = HTMLDivElement | HTMLElement | HTMLAnchorElement;

class DynamicLoadQueue {
    private static instance: DynamicLoadQueue | null = null;
    private queue: TargetObservedElement[] = [];
    private isLocked: boolean = false;
    private observer: IntersectionObserver | null = null;

    private constructor() {
        if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && 
                        (entry.target instanceof HTMLDivElement || 
                         entry.target instanceof HTMLElement || 
                         entry.target instanceof HTMLAnchorElement)) {
                        this.queue.push(entry.target);
                        this.processQueueStart();
                    }
                });
            }, { threshold: 0.1 });
        } else {
            console.warn('IntersectionObserver is not supported');
        }
    }

    static getInstance(): DynamicLoadQueue {
        if (!DynamicLoadQueue.instance) {
            DynamicLoadQueue.instance = new DynamicLoadQueue();
        }
        return DynamicLoadQueue.instance;
    }

    addToQueue(element: TargetObservedElement) {
        if (this.observer) {
            this.observer.observe(element);
        } else {
            // Fallback for environments without IntersectionObserver
            this.queue.push(element);
            this.processQueueStart();
        }
    }

    processQueueStart() {
        const queueMaxSize = 2;
        if (this.queue.length >= queueMaxSize && this.isLocked === true) this.isLocked = false;
        if (this.isLocked === false && this.queue.length < queueMaxSize) {
            this.isLocked = true;
            this.processQueue();
        }
    }

    processQueue() {
        if (this.queue.length === 0) {
            this.isLocked = false;
            return;
        }
        const element = this.queue.shift();
        if (element) {
            this.fadeInElement(element);
            setTimeout(() => {
                this.processQueue();
            }, 50);
        }
    }

    fadeInElement(element: Element) {
        (element as HTMLElement).style.opacity = '1';
        (element as HTMLElement).style.transform = 'translate(0, 0)';
        if (this.observer) {
            this.observer.unobserve(element);
        }
    }
}

export default DynamicLoadQueue;
