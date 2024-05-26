import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import SideBarMenu from './SideBarMenu';
import './sidebar.css';

import { FaBars } from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';

const inputAnimation = {
  hidden: {
    width: 0,
    padding: 0,
    transition: {
      duration: 0.2,
    },
  },
  show: {
    width: '140px',
    padding: '5px 15px',
    transition: {
      duration: 0.2,
    },
  },
};
const showAnimation = {
  hidden: {
    width: 0,
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
  show: {
    opacity: 1,
    width: 'auto',
    transition: {
      duration: 0.5,
    },
  },
};

const SideBar = ({ routes, children,theme}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const currentCategory = getCurrentCategory();
    const scrollbarColor = getScrollbarColor(currentCategory);
    applyScrollbarColor(scrollbarColor);
  }, [location]); // Watch for changes in location state

  const getCurrentCategory = () => {
    const currentPath = location.pathname;
    const category = routes.find((route) => currentPath.startsWith(route.path));
    return currentPath; // Return the category name
  };

  const getScrollbarColor = (currentPath) => {
    switch (currentPath) {
      case '/angular':
        return '#eb0d0d';
      case '/frontend':
        return '#6cd380';
      case '/next':
        return '#68bf6f';
      case '/node':
        return 'green';
      case '/react':
        return 'blue';
      case '/vanilla':
        return '#ffd700';
      case '/vue':
        return 'green';
      default:
        return 'blue';
    }
  };

  const applyScrollbarColor = (color) => {
    const style = document.createElement('style');
    style.textContent = `
      ::-webkit-scrollbar-thumb {
        background: ${color};
        border: 2px solid ${color}; 
        box-shadow: 0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}, 0 0 70px ${color};
        animation: neonGlow 1.5s infinite alternate;
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  };

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <div className={`main-container ${theme}`}>
        <motion.div
          animate={{
            width: isOpen ? '200px' : '75px',
            position: 'fixed',
            transition: { duration: 0.5, type: 'spring', damping: 10 },
          }}
          className={`sidebar ${theme}`}
        >
          <div className={`top_section ${theme} d-lg-flex align-items-center justify-content-center`}>
            <AnimatePresence>
              {isOpen && (
                <motion.h1 variants={showAnimation} initial='hidden' animate='show' exit='hidden' className='logo'>
                  WebMasterLog
                </motion.h1>
              )}
            </AnimatePresence>
            <div className={`bars ${theme} flex-grow d-flex align-items-stretch align-self-center`}>
              <FaBars onClick={toggle} />
            </div>
          </div>

          <div className={`search ${theme}`}>
            <div className={`search_icon circle ${theme}`}>
              <BiSearch />
            </div>
            <AnimatePresence>
              {isOpen && <motion.input initial='hidden' animate='show' exit='hidden' variants={inputAnimation} type='text' placeholder='Search' />}
            </AnimatePresence>
          </div>

          <section className='routes'>
            {routes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SideBarMenu
                    key={index}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    routes={routes} // Pass the routes prop here
                  />
                );
              }

              return (
                <NavLink to={route.path} key={index} className={`link ${theme}`} activeClassName='active'>
                  <div className={`circle ${theme}`}>
                    <div className={`icon ${theme}`}>{route.icon}</div>
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div variants={showAnimation} initial='hidden' animate='show' exit='hidden' className='link_text'>
                        {route.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </section>
        </motion.div>

        <main style={{ marginLeft: 'auto', transition: 'all 0.3s' }}>{children}</main>
      </div>
    </>
  );
};

export default SideBar;
