import { Card, Typography, Avatar, Divider, Space } from '@arco-design/web-react';
import styles from './index.module.less';
import { useI18n } from '@/i18n';

const { Title, Paragraph } = Typography;

const AboutMe = () => {
  const { t } = useI18n();
  return (
    <div className={styles.aboutContainer}>
      <Card className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <Avatar size={100} className={styles.avatar}>
            {t('about.name')}
          </Avatar>
          <div className={styles.profileInfo}>
            <Title heading={2}>{t('about.name')}</Title>
            <Paragraph type="secondary">{t('about.role')}</Paragraph>
          </div>
        </div>

        <Divider />

        <div className={styles.bioSection}>
          <Title heading={4}>{t('about.aboutMeTitle')}</Title>
          <Paragraph>
            {t('about.aboutMe.p1')}
          </Paragraph>
          <Paragraph>
            {t('about.aboutMe.p2')}
          </Paragraph>
        </div>

        <Divider />

        <div className={styles.skillsSection}>
          <Title heading={4}>{t('about.skillsTitle')}</Title>
          <Space direction="vertical" size="medium">
            <div className={styles.skillCategory}>
              <Title heading={5}>{t('about.skill.frontend')}</Title>
              <Paragraph>React, Vue, TypeScript, JavaScript, HTML5, CSS3, Webpack, Vite</Paragraph>
            </div>
            <div className={styles.skillCategory}>
              <Title heading={5}>{t('about.skill.backend')}</Title>
              <Paragraph>Node.js, Express, MongoDB, RESTful API</Paragraph>
            </div>
            <div className={styles.skillCategory}>
              <Title heading={5}>{t('about.skill.other')}</Title>
              <Paragraph>{t('about.otherSkillsList')}</Paragraph>
            </div>
          </Space>
        </div>

        <Divider />

        <div className={styles.contactSection}>
          <Title heading={4}>{t('about.contactTitle')}</Title>
          <Paragraph>
            {t('about.emailLabel')}example@example.com
            <br />
            GitHub: github.com/yourname
            <br />
            {t('about.wechatLabel')}
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default AboutMe;
