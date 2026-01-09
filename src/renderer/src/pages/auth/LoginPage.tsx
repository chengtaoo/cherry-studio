/**
 * Login page for SaaS authentication
 */
import { Button, Form, Input, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '@renderer/store'
import { setUser, setToken, setAuthenticated } from '@renderer/store/saas'
import { getSaaSApiClient } from '@renderer/services/saas/SaaSApiClient'

const LoginPage: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const apiBaseURL = useAppSelector((state) => state.saas.apiBaseURL)
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true)
      const client = getSaaSApiClient(apiBaseURL)
      const response = await client.login({
        email: values.email,
        password: values.password
      })

      if (response.success) {
        dispatch(setUser(response.data.user))
        dispatch(setToken(response.data.token))
        dispatch(setAuthenticated(true))
        message.success(t('saas.login.success', { defaultValue: '登录成功' }))
        navigate('/')
      }
    } catch (error: any) {
      message.error(error.message || t('saas.login.failed', { defaultValue: '登录失败' }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <LoginCard>
        <Title>{t('saas.login.title', { defaultValue: '登录 Cherry Studio' })}</Title>
        <Form name="login" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: t('saas.login.email_required', { defaultValue: '请输入邮箱' }) },
              { type: 'email', message: t('saas.login.email_invalid', { defaultValue: '请输入有效的邮箱地址' }) }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t('saas.login.email_placeholder', { defaultValue: '邮箱' })}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: t('saas.login.password_required', { defaultValue: '请输入密码' }) }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t('saas.login.password_placeholder', { defaultValue: '密码' })}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {t('saas.login.button', { defaultValue: '登录' })}
            </Button>
          </Form.Item>
        </Form>

        <Footer>
          <Link to="/auth/register">
            {t('saas.login.register_link', { defaultValue: '还没有账户？立即注册' })}
          </Link>
        </Footer>
      </LoginCard>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--color-background);
`

const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`

const Title = styled.h1`
  text-align: center;
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-1);
`

const Footer = styled.div`
  text-align: center;
  margin-top: 16px;
  
  a {
    color: var(--color-primary);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

export default LoginPage
