import React from 'react';
import './SkeletonPage.css';
import { useScrollToTopOnLoad } from '../../components/Utility/ScrollUtility';

const SkeletonPage: React.FC = () => {
    useScrollToTopOnLoad();

    return (
        <main className="skeleton-page">
            <div className="skeleton-component skeleton-page__header w-full"></div>
        </main>
    );
};

export default SkeletonPage;
