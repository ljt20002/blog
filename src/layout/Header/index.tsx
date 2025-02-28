import { Avatar, Grid } from '@arco-design/web-react';
import styles from './index.module.less';
const { Row } = Grid;
const Header = () => (
  <div>
    <Row className={styles.AvatarBox}>
      <Avatar size={90}>
        <img
          alt="avatar"
          src="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
        />
      </Avatar>
    </Row>
    <Row className={styles.TitleBox}>嘉图的网络日志</Row>
  </div>
);

export default Header;
