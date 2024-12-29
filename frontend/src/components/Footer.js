import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-primary">
      <div className="container py-2">
        <div className="row">
          <div className="col">
            <p className="mb-0 text-center text-white">
              &copy; {year}.All Rights Reserved by Hafiz Abeer.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
