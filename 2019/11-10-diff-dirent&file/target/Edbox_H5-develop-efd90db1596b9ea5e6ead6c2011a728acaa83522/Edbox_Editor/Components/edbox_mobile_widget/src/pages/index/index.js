import React from 'react';
import Link from 'umi/link';
import styles from './index.scss';

export default function() {
  return (
    <div className="page-wrap black nhd">
      <ul className={styles['nav-link']}>
        <li>
          <Link to="/Edbox_TextSelector">Edbox_TextSelector</Link>
        </li>
        <li>
          <Link to="/Edbox_AudioSelector">Edbox_AudioSelector</Link>
        </li>
        <li>
          <Link to="/Edbox_ImageSelector">Edbox_ImageSelector</Link>
        </li>
      </ul>
    </div>
  )
}
