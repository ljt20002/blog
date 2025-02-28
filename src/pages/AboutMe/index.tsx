import { Card, Typography, Avatar, Divider, Space } from '@arco-design/web-react';
import styles from './index.module.less';

const { Title, Paragraph } = Typography;

const AboutMe = () => (
  <div className={styles.aboutContainer}>
    <Card className={styles.profileCard}>
      <div className={styles.profileHeader}>
        <Avatar size={100} className={styles.avatar}>
          嘉图
        </Avatar>
        <div className={styles.profileInfo}>
          <Title heading={2}>嘉图</Title>
          <Paragraph type="secondary">前端开发工程师 / 技术博主</Paragraph>
        </div>
      </div>

      <Divider />

      <div className={styles.bioSection}>
        <Title heading={4}>关于我</Title>
        <Paragraph>
          你好！我是嘉图，一名热爱技术的前端开发工程师。我喜欢探索新技术，解决复杂问题，并通过博客分享我的学习心得和技术见解。
        </Paragraph>
        <Paragraph>
          我专注于现代前端技术栈，包括 React、TypeScript、Node.js
          等。同时，我也对设计模式、性能优化和用户体验有浓厚的兴趣。
        </Paragraph>
      </div>

      <Divider />

      <div className={styles.skillsSection}>
        <Title heading={4}>技能专长</Title>
        <Space direction="vertical" size="medium">
          <div className={styles.skillCategory}>
            <Title heading={5}>前端开发</Title>
            <Paragraph>React, Vue, TypeScript, JavaScript, HTML5, CSS3, Webpack, Vite</Paragraph>
          </div>
          <div className={styles.skillCategory}>
            <Title heading={5}>后端技术</Title>
            <Paragraph>Node.js, Express, MongoDB, RESTful API</Paragraph>
          </div>
          <div className={styles.skillCategory}>
            <Title heading={5}>其他技能</Title>
            <Paragraph>Git, Docker, CI/CD, 性能优化, 响应式设计</Paragraph>
          </div>
        </Space>
      </div>

      <Divider />

      <div className={styles.contactSection}>
        <Title heading={4}>联系方式</Title>
        <Paragraph>
          邮箱：example@example.com
          <br />
          GitHub：github.com/yourname
          <br />
          微信公众号：嘉图的技术分享
        </Paragraph>
      </div>
    </Card>
  </div>
);

export default AboutMe;
