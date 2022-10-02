import React from "react";
import { useState } from "react";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <header className="app-header">
        <h2>GEKA</h2>
        <ul className="desktop">
          <li>
            <a href="#hakkimizda">Hakkımızda</a>
          </li>
          <li>
            <a href="#urunler">Ürünler</a>
          </li>
          <li>
            <a href="#iletisim">İletişim</a>
          </li>
        </ul>
        <div
          className="hamburger"
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
      </header>
      {showMenu && (
        <ul className="mobile">
          <li>
            <a
              href="#hakkimizda"
              onClick={() => {
                setShowMenu(!showMenu);
              }}
            >
              Hakkımızda
            </a>
          </li>
          <li>
            <a
              href="#urunler"
              onClick={() => {
                setShowMenu(!showMenu);
              }}
            >
              Ürünler
            </a>
          </li>
          <li>
            <a
              href="#iletisim"
              onClick={() => {
                setShowMenu(!showMenu);
              }}
            >
              İletişim
            </a>
          </li>
        </ul>
      )}
    </>
  );
}
