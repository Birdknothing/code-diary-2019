import {} from 'antd';
import Link from 'umi/link';

export default () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/Edbox_TextSelector">Edbox_TextSelector</Link>
        </li>
        <li>
          <Link to="/Edbox_AudioSelector">Edbox_AudioSelector</Link>
        </li>
        <li>
          <Link to="/Edbox_ImageSelector">Edbox_ImageSelector</Link>
        </li>
        <li>
          <Link to="/Edbox_FrameSelector">Edbox_FrameSelector</Link>
        </li>
      </ul>
    </div>
  );
};
