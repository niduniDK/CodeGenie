import React from 'react';
import icon from './assets/icon.png'

function NavBar(){
    return (
        <div className="flex items-center justify-between p-4 bg-white">
            <h1 className="text-2xl font-bold text-purple-950 cursor-pointer">CodeGenie</h1>
            <nav className="space-x-4">
                <a href="/" ><img src={icon} alt="" /></a>
                
            </nav>
        </div>
    );
}

export default NavBar;