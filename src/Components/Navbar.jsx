import { useEffect, useState } from "react"
import { VscThreeBars } from "react-icons/vsc";
import { TbXboxX } from "react-icons/tb";

const Navbar = () => {
  const [mobileNavbar, setMobileNavbar] = useState(false)
  useEffect(() => {
    const handleResize = () =>{
      if(window.innerWidth <= 414) {
        document.getElementById('navbar').style.display = 'none'
      } else {
        document.getElementById('navbar').style.display = 'flex'
        document.getElementById('navbar-mobile').style.display = 'none'

        
      }
    }

    window.addEventListener('resize', handleResize)

    handleResize( )
  }, [])

  const onClickOpenNav = () => {
    var elements = document.querySelectorAll('#navbar-mobile-button')
    if(!mobileNavbar) {
      elements.forEach(x => {
          x.style.display = 'flex'
      })
    } else {
      elements.forEach(x => {
          x.style.display = 'none'
      })

    }

    mobileNavbar ? setMobileNavbar(false) : setMobileNavbar(true)
  }

  return (
<>
    <div id="navbar-mobile" onClick={onClickOpenNav} className="flex-col space-y-1">
      <span id="nav-toggle" className="btn w-12 h-12 hover:bg-slate-500"> {mobileNavbar ? <TbXboxX /> : <VscThreeBars />}</span>
      <div id="navbar-mobile-button" className="w-full h-12 text-center align-middle gap-3 bg-slate-600 rounded-md hidden hover:bg-slate-400"><a href="https://git.ibrahimhalilsezgin.fun/">Projects</a></div>
      <div id="navbar-mobile-button" className="w-full h-12 text-center align-middle gap-3 bg-slate-600 rounded-md hidden">TEST</div>
    </div>
    <div id="navbar" className='flex navbar bg-zinc-700'>
        <div className="navbar-start"></div>
        <div className="navbar-end">
            <li className='list-comp'><a href="https://git.ibrahimhalilsezgin.fun/">Projects</a></li>
            <li className='list-comp'>Projects</li>
        </div>

    </div>
  </>
  )
}

export default Navbar