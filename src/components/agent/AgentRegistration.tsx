'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { AIProfile } from '@/lib/ai-profiles'

interface RegistrationFormData {
  name: string
  description: string
  personality: string
  avatar: string
  capabilities: string[]
  tradingStyle: 'aggressive' | 'conservative' | 'balanced'
}

interface AgentRegistrationProps {
  onSubmit: (data: RegistrationFormData) => void
  onCancel?: () => void
  isLoading?: boolean
}

const personalityOptions = [
  { id: 'aggressive', name: 'Aggressive Risk Taker', emoji: '🔥', description: 'High-risk, high-reward strategies' },
  { id: 'defensive', name: 'Patient Defender', emoji: '🛡️', description: 'Focus on minimizing losses' },
  { id: 'balanced', name: 'Adaptive Strategist', emoji: '⚖️', description: 'Balanced approach to all situations' },
  { id: 'analytical', name: 'Analytical Expert', emoji: '🧠', description: 'Data-driven decision making' },
  { id: 'opportunistic', name: 'Opportunistic Hunter', emoji: '🎯', description: 'Waits for perfect opportunities' },
]

const capabilityOptions = [
  { id: 'technical-analysis', name: 'Technical Analysis', emoji: '📊' },
  { id: 'fundamental-analysis', name: 'Fundamental Analysis', emoji: '📈' },
  { id: 'risk-management', name: 'Risk Management', emoji: '🎚️' },
  { id: 'market-prediction', name: 'Market Prediction', emoji: '🔮' },
  { id: 'portfolio-optimization', name: 'Portfolio Optimization', emoji: '⚙️' },
  { id: 'sentiment-analysis', name: 'Sentiment Analysis', emoji: '💭' },
  { id: 'arbitrage', name: 'Arbitrage', emoji: '⚡' },
  { id: 'defi-ops', name: 'DeFi Operations', emoji: '🔗' },
]

const avatarOptions = [
  '/avatars/agent-1.png',
  '/avatars/agent-2.png',
  '/avatars/agent-3.png',
  '/avatars/agent-4.png',
  '/avatars/agent-5.png',
  '/avatars/agent-6.png',
]

const defaultAvatar = '/avatars/default-agent.png'

export function AgentRegistration({ onSubmit, onCancel, isLoading = false }: AgentRegistrationProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    description: '',
    personality: 'balanced',
    avatar: defaultAvatar,
    capabilities: [],
    tradingStyle: 'balanced',
  })
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatar)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }))
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, description: e.target.value }))
  }

  const handlePersonalitySelect = (personalityId: string) => {
    setFormData(prev => ({ ...prev, personality: personalityId }))
  }

  const handleCapabilityToggle = (capabilityId: string) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.includes(capabilityId)
        ? prev.capabilities.filter(id => id !== capabilityId)
        : [...prev.capabilities, capabilityId]
    }))
  }

  const handleAvatarSelect = (avatar: string) => {
    setFormData(prev => ({ ...prev, avatar }))
    setAvatarPreview(avatar)
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim().length >= 3
      case 2:
        return formData.capabilities.length >= 1
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800/80 rounded-xl border border-gray-700">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all',
                step === s
                  ? 'bg-purple-600 text-white scale-110'
                  : step > s
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-400'
              )}
            >
              {step > s ? '✓' : s}
            </div>
            {s < 3 && (
              <div
                className={cn(
                  'w-12 h-1 mx-1 rounded',
                  step > s ? 'bg-green-600' : 'bg-gray-700'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Agent Identity</h2>
            <p className="text-gray-400">Give your AI agent a unique identity</p>
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Agent Avatar
            </label>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={avatarPreview}
                alt="Selected avatar"
                className="w-20 h-20 rounded-full bg-gray-700 border-2 border-purple-500"
              />
              <div className="flex flex-wrap gap-2">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => handleAvatarSelect(avatar)}
                    className={cn(
                      'w-12 h-12 rounded-full bg-gray-700 border-2 transition-all',
                      formData.avatar === avatar
                        ? 'border-purple-500 scale-110'
                        : 'border-gray-600 hover:border-gray-500'
                    )}
                  >
                    <img src={avatar} alt="" className="w-full h-full rounded-full" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Agent Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Enter agent name (min 3 characters)"
              className={cn(
                'w-full px-4 py-3 bg-gray-900 border rounded-xl text-white placeholder-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                'transition-all'
              )}
              maxLength={30}
            />
            <p className="mt-1 text-xs text-gray-500">{formData.name.length}/30 characters</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Agent Description
            </label>
            <textarea
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Describe your agent's personality and trading style..."
              className={cn(
                'w-full px-4 py-3 bg-gray-900 border rounded-xl text-white placeholder-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                'transition-all resize-none'
              )}
              rows={3}
              maxLength={200}
            />
            <p className="mt-1 text-xs text-gray-500">{formData.description.length}/200 characters</p>
          </div>
        </div>
      )}

      {/* Step 2: Capabilities */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Agent Capabilities</h2>
            <p className="text-gray-400">Select at least one capability</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {capabilityOptions.map((cap) => (
              <button
                key={cap.id}
                onClick={() => handleCapabilityToggle(cap.id)}
                className={cn(
                  'p-4 rounded-xl border transition-all text-left',
                  formData.capabilities.includes(cap.id)
                    ? 'bg-purple-900/30 border-purple-500 text-white'
                    : 'bg-gray-900/50 border-gray-700 text-gray-300 hover:border-gray-600'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cap.emoji}</span>
                  <span className="font-medium">{cap.name}</span>
                  {formData.capabilities.includes(cap.id) && (
                    <span className="ml-auto text-green-400">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {formData.capabilities.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Selected capabilities:</p>
              <div className="flex flex-wrap gap-2">
                {formData.capabilities.map((capId) => {
                  const cap = capabilityOptions.find(c => c.id === capId)
                  return (
                    <span
                      key={capId}
                      className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm"
                    >
                      {cap?.emoji} {cap?.name}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Personality & Trading Style */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Personality & Style</h2>
            <p className="text-gray-400">Define how your agent thinks and trades</p>
          </div>

          {/* Personality Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Agent Personality
            </label>
            <div className="space-y-2">
              {personalityOptions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePersonalitySelect(p.id)}
                  className={cn(
                    'w-full p-4 rounded-xl border transition-all text-left',
                    formData.personality === p.id
                      ? 'bg-purple-900/30 border-purple-500'
                      : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.emoji}</span>
                    <div>
                      <p className={cn('font-medium', formData.personality === p.id ? 'text-white' : 'text-gray-300')}>
                        {p.name}
                      </p>
                      <p className="text-sm text-gray-500">{p.description}</p>
                    </div>
                    {formData.personality === p.id && (
                      <span className="ml-auto text-green-400">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Trading Style */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Trading Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['aggressive', 'conservative', 'balanced'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setFormData(prev => ({ ...prev, tradingStyle: style }))}
                  className={cn(
                    'p-3 rounded-xl border transition-all text-center capitalize',
                    formData.tradingStyle === style
                      ? 'bg-purple-900/30 border-purple-500 text-white'
                      : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:border-gray-600'
                  )}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-3">Registration Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-white">{formData.name || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Capabilities:</span>
                <span className="text-white">{formData.capabilities.length} selected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Personality:</span>
                <span className="text-white">{personalityOptions.find(p => p.id === formData.personality)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Trading Style:</span>
                <span className="text-white capitalize">{formData.tradingStyle}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 mt-8">
        {step > 1 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex-1 py-3 rounded-xl font-bold bg-gray-700 text-white hover:bg-gray-600 transition-all"
          >
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canProceed()}
            className={cn(
              'flex-1 py-3 rounded-xl font-bold transition-all',
              canProceed()
                ? 'bg-purple-600 text-white hover:bg-purple-500'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            )}
          >
            Next Step
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoading || !canProceed()}
            className={cn(
              'flex-1 py-3 rounded-xl font-bold transition-all',
              canProceed() && !isLoading
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            )}
          >
            {isLoading ? 'Registering...' : 'Register Agent'}
          </button>
        )}
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-xl font-bold bg-gray-700 text-white hover:bg-gray-600 transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

interface AgentCapabilitySelectorProps {
  capabilities: string[]
  onChange: (capabilities: string[]) => void
  maxSelection?: number
}

export function AgentCapabilitySelector({
  capabilities,
  onChange,
  maxSelection = 5
}: AgentCapabilitySelectorProps) {
  const handleToggle = (capabilityId: string) => {
    if (capabilities.includes(capabilityId)) {
      onChange(capabilities.filter(id => id !== capabilityId))
    } else if (capabilities.length < maxSelection) {
      onChange([...capabilities, capabilityId])
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {capabilityOptions.map((cap) => (
        <button
          key={cap.id}
          onClick={() => handleToggle(cap.id)}
          disabled={!capabilities.includes(capabilityId) && capabilities.length >= maxSelection}
          className={cn(
            'p-2 rounded-lg border transition-all text-left text-sm',
            capabilities.includes(cap.id)
              ? 'bg-purple-900/30 border-purple-500 text-white'
              : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:border-gray-600',
            !capabilities.includes(cap.id) && capabilities.length >= maxSelection && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span className="mr-2">{cap.emoji}</span>
          {cap.name}
        </button>
      ))}
    </div>
  )
}
