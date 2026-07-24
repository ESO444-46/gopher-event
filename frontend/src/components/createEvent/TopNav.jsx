import { Link } from "react-router-dom";

const TopNav = () => {
    return(

        <>
        <header className="create-top-nav border-b">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center">
              <div className="flex items-center gap-3">
                <div className="brand-mark h-8 w-8 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="brand-name font-semibold">Gopher Event</span>
              </div>
            </div>
        </header>
        </>


    )
}


export default TopNav
