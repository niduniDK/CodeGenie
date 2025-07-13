import React from 'react';
import icon from './assets/icon.png'

function NavBar(){

    const handleGetDASGuide = () => {
        window.location.href = '/chat';
        localStorage.setItem("isDSAGuide", true);
    }

    return (
        <div className="flex items-center justify-between p-4 bg-slate-100">
            <h1 className="text-2xl font-bold text-purple-950 cursor-pointer">CodeGenie</h1>
            
            <nav className="flex flex-row space-x-4">
                <button
                className='bg-purple-950 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300'
                onClick={handleGetDASGuide}
                >DSA Guide</button>
                <a href="/" ><img src={icon} alt="" /></a>
                
            </nav>
        </div>
    );
}

export default NavBar;