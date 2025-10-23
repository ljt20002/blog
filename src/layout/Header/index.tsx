import { Avatar, Grid } from '@arco-design/web-react';
import { useI18n } from '@/i18n';
import styles from './index.module.less';
const { Row } = Grid;
const Header = () => {
  const { t } = useI18n();
  return (
    <div>
      <Row className={styles.AvatarBox}>
        <Avatar size={90}>
          <img
            alt={t('about.avatarAlt')}
            src="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
          />
        </Avatar>
      </Row>
      <Row className={styles.TitleBox}>{t('site.title')}</Row>
    </div>
  );
};

export default Header;
