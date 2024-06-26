import React from "react";
import Link from "next/link";


const BuyMeACoffeeButton: React.FC<{}> = () => {
    return (
        <Link href="https://ko-fi.com/D1D1PFTTH" target="_blank" rel="noopener noreferrer">
            <img height="36" style={{ border: "0px", height: "36px" }} src="https://storage.ko-fi.com/cdn/kofi2.png?v=3" alt="Buy Me a Coffee at ko-fi.com" />
        </Link>
    );
}

export default BuyMeACoffeeButton;
