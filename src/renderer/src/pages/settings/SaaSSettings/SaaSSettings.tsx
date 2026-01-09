/**
 * SaaS Settings page
 */
import { Button, Input, Switch, message, Card, Space, Typography, Divider, Alert } from 'antd'
import { CloudSyncOutlined, LogoutOutlined, UserOutlined, SyncOutlined } from '@ant-design/icons'
import type { FC } from 'react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '@renderer/store'
import { setApiBaseURL, setEnabled, logout, setSyncing, setLastSyncTime, setSyncError } from '@renderer/store/saas'
import { getSaaSApiClient } from '@renderer/services/saas/SaaSApiClient'
import { SettingContainer, SettingGroup, SettingTitle, SettingDivider, SettingRow, SettingRowTitle, SettingHelpText } from '..'
import { useTheme } from '@renderer/context/ThemeProvider'
import db from '@renderer/databases'
import store from '@renderer/store'

const { Text, Paragraph } = Typography

const SaaSSettings: FC = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const saasState = useAppSelector((state) => state.saas)
  const [apiURL, setApiURL] = useState(saasState.apiBaseURL)
  const [syncing, setSyncingState] = useState(false)

  useEffect(() => {
    setApiURL(saasState.apiBaseURL)
  }, [saasState.apiBaseURL])

  const handleEnableChange = (checked: boolean) => {
    dispatch(setEnabled(checked))
    if (!checked) {
      dispatch(logout())
    }
  }

  const handleApiURLChange = (value: string) => {
    setApiURL(value)
  }

  const handleSaveApiURL = () => {
    dispatch(setApiBaseURL(apiURL))
    message.success(t('saas.settings.api_url_saved', { defaultValue: 'API 地址已保存' }))
  }

  const handleLogin = () => {
    navigate('/auth/login')
  }

  const handleRegister = () => {
    navigate('/auth/register')
  }

  const handleLogout = () => {
    dispatch(logout())
    const client = getSaaSApiClient(saasState.apiBaseURL)
    client.logout()
    message.success(t('saas.settings.logout_success', { defaultValue: '已退出登录' }))
  }

  const handleSync = async () => {
    if (!saasState.isAuthenticated) {
      message.warning(t('saas.settings.login_required', { defaultValue: '请先登录' }))
      return
    }

    try {
      setSyncingState(true)
      dispatch(setSyncing(true))
      dispatch(setSyncError(null))

      const client = getSaaSApiClient(saasState.apiBaseURL)

      // Collect local data
      const topics = await db.topics.toArray()
      const settings = await db.settings.toArray()
      const assistants = store.getState().assistants.assistants
      const knowledgeNotes = await db.knowledge_notes.toArray()
      const files = await db.files.toArray()

      // Convert to sync format
      const topicsData = topics.map((topic) => ({
        id: topic.id,
        title: topic.messages?.[0]?.content?.substring(0, 100) || 'Untitled',
        messages: topic.messages || []
      }))

      const settingsData: Record<string, any> = {}
      for (const setting of settings) {
        settingsData[setting.id] = setting.value
      }

      const assistantsData: Record<string, any> = {}
      for (const [id, assistant] of Object.entries(assistants)) {
        assistantsData[id] = assistant
      }

      const knowledgeNotesData = knowledgeNotes.map((note) => ({
        id: note.id,
        baseId: note.baseId,
        type: note.type,
        content: note.content
      }))

      const filesData = files.map((file) => ({
        id: file.id,
        name: file.name,
        originName: file.origin_name,
        path: file.path,
        size: file.size,
        ext: file.ext,
        type: file.type,
        count: file.count
      }))

      // Sync all data
      await client.syncAll({
        topics: topicsData,
        settings: settingsData,
        assistants: assistantsData,
        knowledgeNotes: knowledgeNotesData,
        files: filesData
      })

      dispatch(setLastSyncTime(Date.now()))
      message.success(t('saas.settings.sync_success', { defaultValue: '数据同步成功' }))
    } catch (error: any) {
      const errorMessage = error.message || t('saas.settings.sync_failed', { defaultValue: '数据同步失败' })
      dispatch(setSyncError(errorMessage))
      message.error(errorMessage)
    } finally {
      setSyncingState(false)
      dispatch(setSyncing(false))
    }
  }

  const formatLastSyncTime = (timestamp: number | null): string => {
    if (!timestamp) return t('saas.settings.never_synced', { defaultValue: '从未同步' })
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <SettingContainer theme={theme}>
      <SettingGroup theme={theme}>
        <SettingTitle>{t('saas.settings.title', { defaultValue: '云端同步' })}</SettingTitle>
        <SettingDivider />

        <SettingRow>
          <SettingRowTitle>{t('saas.settings.enable', { defaultValue: '启用云端同步' })}</SettingRowTitle>
          <Switch checked={saasState.isEnabled} onChange={handleEnableChange} />
        </SettingRow>
        <SettingRow>
          <SettingHelpText>
            {t('saas.settings.enable_help', {
              defaultValue: '启用后，您的数据将同步到云端，可在多设备间访问'
            })}
          </SettingHelpText>
        </SettingRow>

        {saasState.isEnabled && (
          <>
            <SettingDivider />
            <SettingRow>
              <SettingRowTitle>{t('saas.settings.api_url', { defaultValue: 'API 地址' })}</SettingRowTitle>
              <Space.Compact style={{ width: '100%', maxWidth: '500px' }}>
                <Input
                  value={apiURL}
                  onChange={(e) => handleApiURLChange(e.target.value)}
                  placeholder="http://localhost:3000"
                />
                <Button onClick={handleSaveApiURL}>
                  {t('saas.settings.save', { defaultValue: '保存' })}
                </Button>
              </Space.Compact>
            </SettingRow>

            <SettingDivider />

            {saasState.isAuthenticated ? (
              <>
                <Card size="small" style={{ marginBottom: 16 }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                      <UserOutlined />
                      <Text strong>{saasState.user?.displayName || saasState.user?.username}</Text>
                      <Text type="secondary">({saasState.user?.email})</Text>
                    </Space>
                    {saasState.lastSyncTime && (
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {t('saas.settings.last_sync', { defaultValue: '最后同步' })}: {formatLastSyncTime(saasState.lastSyncTime)}
                      </Text>
                    )}
                  </Space>
                </Card>

                {saasState.syncError && (
                  <Alert
                    message={t('saas.settings.sync_error', { defaultValue: '同步错误' })}
                    description={saasState.syncError}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                )}

                <SettingRow>
                  <Space>
                    <Button
                      type="primary"
                      icon={<SyncOutlined />}
                      loading={syncing || saasState.isSyncing}
                      onClick={handleSync}
                    >
                      {t('saas.settings.sync_now', { defaultValue: '立即同步' })}
                    </Button>
                    <Button icon={<LogoutOutlined />} onClick={handleLogout}>
                      {t('saas.settings.logout', { defaultValue: '退出登录' })}
                    </Button>
                  </Space>
                </SettingRow>
              </>
            ) : (
              <>
                <Alert
                  message={t('saas.settings.not_logged_in', { defaultValue: '未登录' })}
                  description={t('saas.settings.login_to_sync', {
                    defaultValue: '请登录以启用云端同步功能'
                  })}
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <SettingRow>
                  <Space>
                    <Button type="primary" icon={<UserOutlined />} onClick={handleLogin}>
                      {t('saas.settings.login', { defaultValue: '登录' })}
                    </Button>
                    <Button onClick={handleRegister}>
                      {t('saas.settings.register', { defaultValue: '注册' })}
                    </Button>
                  </Space>
                </SettingRow>
              </>
            )}
          </>
        )}
      </SettingGroup>
    </SettingContainer>
  )
}

export default SaaSSettings
