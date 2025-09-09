import React, { useState } from 'react';

import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  LoginOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Checkbox, Form, Input, message, Typography } from 'antd';

import './index.scss';

const { Title, Text, Link } = Typography;

interface ILoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: ILoginFormValues) => {
    setLoading(true);
    try {
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success(`欢迎 ${values.username}！登录成功`);
      // 这里可以添加实际的登录逻辑，比如调用登录API
      // await loginApi(values);
    } catch {
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-overlay" />
      </div>

      <div className="login-content">
        <Card className="login-card" bordered={false}>
          <div className="login-header">
            <div className="login-logo">
              <LoginOutlined className="logo-icon" />
            </div>
            <Title level={2} className="login-title">
              欢迎回来
            </Title>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
            className="login-form"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名或邮箱' },
                { min: 3, message: '用户名至少3个字符' },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="用户名或邮箱" className="login-input" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className="login-input"
              />
            </Form.Item>

            <Form.Item>
              <div className="login-options">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
                <Link href="#" className="forgot-password">
                  忘记密码？
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="login-button"
                block
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          {/* <Divider className="login-divider">
            <Text type="secondary">或者使用以下方式登录</Text>
          </Divider> */}

          {/* <div className="social-login">
            <Space size="large">
              <Button
                shape="circle"
                icon={<GithubOutlined />}
                size="large"
                className="social-button github"
                onClick={() => handleSocialLogin('GitHub')}
              />
              <Button
                shape="circle"
                icon={<WechatOutlined />}
                size="large"
                className="social-button wechat"
                onClick={() => handleSocialLogin('微信')}
              />
              <Button
                shape="circle"
                icon={<AlipayOutlined />}
                size="large"
                className="social-button alipay"
                onClick={() => handleSocialLogin('支付宝')}
              />
            </Space>
          </div> */}

          <div className="login-footer">
            <Text type="secondary">
              <Link href="#" strong>
                立即注册
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
