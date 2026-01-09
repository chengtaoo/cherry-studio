/**
 * Register page for SaaS authentication
 */
import { Button, Form, Input, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '@renderer/store'
import { setUser, setToken, setAuthenticated } from '@renderer/store/saas'
import { getSaaSApiClient } from '@renderer/services/saas/SaaSApiClient'

const RegisterPage: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const apiBaseURL = useAppSelector((state) => state.saas.apiBaseURL)
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: {
    email: string
    username: string
    password: string
    confirmPassword: string
    displayName?: string
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error(t('saas.register.password_mismatch', { defaultValue: '两次输入的密码不一致' }))
      return
    }

    try {
      setLoading(true)
      const client = getSaaSApiClient(apiBaseURL)
      const response = await client.register({
        email: values.email,
        username: values.username,
        password: values.password,
        displayName: values.displayName
      })

      if (response.success) {
        dispatch(setUser(response.data.user))
        dispatch(setToken(response.data.token))
        dispatch(setAuthenticated(true))
        message.success(t('saas.register.success', { defaultValue: '注册成功' }))
        navigate('/')
      }
    } catch (error: any) {
      message.error(error.message || t('saas.register.failed', { defaultValue: '注册失败' }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container>
      <RegisterCard>
        <Title>{t('saas.register.title', { defaultValue: '注册 Cherry Studio' })}</Title>
        <Form name="register" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: t('saas.register.email_required', { defaultValue: '请输入邮箱' }) },
              { type: 'email', message: t('saas.register.email_invalid', { defaultValue: '请输入有效的邮箱地址' }) }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder={t('saas.register.email_placeholder', { defaultValue: '邮箱' })}
            />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[
              { required: true, message: t('saas.register.username_required', { defaultValue: '请输入用户名' }) },
              { min: 3, message: t('saas.register.username_min', { defaultValue: '用户名至少3个字符' }) },
              { max: 100, message: t('saas.register.username_max', { defaultValue: '用户名最多100个字符' }) }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t('saas.register.username_placeholder', { defaultValue: '用户名' })}
            />
          </Form.Item>

          <Form.Item
            name="displayName"
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t('saas.register.display_name_placeholder', { defaultValue: '显示名称（可选）' })}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: t('saas.register.password_required', { defaultValue: '请输入密码' }) },
              { min: 8, message: t('saas.register.password_min', { defaultValue: '密码至少8个字符' }) }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t('saas.register.password_placeholder', { defaultValue: '密码' })}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: t('saas.register.confirm_password_required', { defaultValue: '请确认密码' }) },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error(t('saas.register.password_mismatch', { defaultValue: '两次输入的密码不一致' })))
                }
              })
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t('saas.register.confirm_password_placeholder', { defaultValue: '确认密码' })}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {t('saas.register.button', { defaultValue: '注册' })}
            </Button>
          </Form.Item>
        </Form>

        <Footer>
          <Link to="/auth/login">
            {t('saas.register.login_link', { defaultValue: '已有账户？立即登录' })}
          </Link>
        </Footer>
      </RegisterCard>
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

const RegisterCard = styled.div`
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

export default RegisterPage
