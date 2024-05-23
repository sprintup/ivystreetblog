'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const Nav = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = href => pathname === href;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const NavLink = ({ href, children, onClick }) => (
    <Link
      href={href}
      className={`text-yellow hover:text-orange focus:text-orange ${
        isActive(href) ? 'font-bold' : ''
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );

  const MobileNavLink = ({ href, children, onClick }) => (
    <Link
      href={href}
      className={`text-yellow hover:text-orange focus:text-orange block px-3 py-2 rounded-md text-base font-medium ${
        isActive(href) ? 'bg-primary' : ''
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );

  return (
    <header className='bg-secondary sticky top-0 z-50 border-b-2 border-solid border-accent-100'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            {/* Logo */}
            <Link
              href='/'
              onClick={closeMenu}
              style={{ textDecoration: 'none' }}
            >
              <div className='flex items-center'>
                <Image
                  src='/logo.png'
                  alt='Logo'
                  width={40}
                  height={40}
                  className='rounded-full'
                />
              </div>
            </Link>
            <Link
              href='/'
              onClick={closeMenu}
              style={{ textDecoration: 'none' }}
            >
              <div className='flex items-center'>
                <span className='ml-2 text-yellow font-bold'>
                  Ivy Street Blog
                </span>
              </div>
            </Link>
          </div>
          <div className='hidden md:block'>
            {/* Nav Links */}
            <div className='ml-10 flex items-baseline space-x-4'>
              {session && (
                <>
                  <span>Welcome, {session.user.name}!</span>
                  <NavLink
                    href='/my-collection'
                    isActive={isActive}
                    onClick={closeMenu}
                  >
                    My Collection
                  </NavLink>
                  <NavLink
                    href='/my-bookshelf'
                    isActive={isActive}
                    onClick={closeMenu}
                  >
                    My Bookshelf
                  </NavLink>
                  <NavLink
                    href='/reading-list'
                    isActive={isActive}
                    onClick={closeMenu}
                  >
                    My Reading List
                  </NavLink>
                  <NavLink
                    href='/profile'
                    isActive={isActive}
                    onClick={closeMenu}
                  >
                    Profile
                  </NavLink>
                </>
              )}
              {!session && (
                <>
                  <NavLink href='/' isActive={isActive} onClick={closeMenu}>
                    About
                  </NavLink>
                  <NavLink
                    href='/register'
                    isActive={isActive}
                    onClick={closeMenu}
                  >
                    Register
                  </NavLink>
                </>
              )}
              {session ? (
                <NavLink
                  href='/api/auth/signout?callbackUrl=/'
                  onClick={closeMenu}
                >
                  Logout
                </NavLink>
              ) : (
                <NavLink
                  href='/api/auth/signin?callbackUrl=/my-bookshelf'
                  onClick={closeMenu}
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
          <div className='-mr-2 flex md:hidden'>
            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              type='button'
              className='inline-flex items-center justify-center p-2 rounded-md text-yellow hover:text-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-yellow'
              aria-expanded='false'
            >
              <span className='sr-only'>Open main menu</span>
              {/* Icon when menu is closed. */}
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
              {/* Icon when menu is open. */}
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
          {session && (
            <>
              <span className='block px-3 py-2'>
                Welcome, {session.user.name}!
              </span>
              <MobileNavLink
                href='/my-collection'
                isActive={isActive}
                onClick={closeMenu}
              >
                My Collection
              </MobileNavLink>
              <MobileNavLink
                href='/my-bookshelf'
                isActive={isActive}
                onClick={closeMenu}
              >
                My Bookshelf
              </MobileNavLink>
              <MobileNavLink
                href='/reading-list'
                isActive={isActive}
                onClick={closeMenu}
              >
                My Reading List
              </MobileNavLink>
              <MobileNavLink
                href='/profile'
                isActive={isActive}
                onClick={closeMenu}
              >
                Profile
              </MobileNavLink>
            </>
          )}
          {!session && (
            <>
              <MobileNavLink href='/' isActive={isActive} onClick={closeMenu}>
                About
              </MobileNavLink>
              <MobileNavLink
                href='/register'
                isActive={isActive}
                onClick={closeMenu}
              >
                Register
              </MobileNavLink>
            </>
          )}
          {session ? (
            <MobileNavLink
              href='/api/auth/signout?callbackUrl=/'
              onClick={closeMenu}
            >
              Logout
            </MobileNavLink>
          ) : (
            <MobileNavLink
              href='/api/auth/signin?callbackUrl=/my-bookshelf'
              onClick={closeMenu}
            >
              Login
            </MobileNavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Nav;
