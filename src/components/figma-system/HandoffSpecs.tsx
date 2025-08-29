/**
 * 06_Handoff: Development Handoff Specifications
 * 목적: 개발자를 위한 상세 스펙과 에셋 가이드
 */

import React, { useState } from 'react';
import { Card } from '../design-system/Card';
import { Button } from '../design-system/Button';
import { cn } from '../ui/utils';
import { 
  Copy, 
  Download, 
  Code, 
  Palette, 
  Type, 
  Move3D,
  Smartphone,
  Check
} from 'lucide-react';

interface SpecItemProps {
  label: string;
  value: string;
  unit?: string;
  copyable?: boolean;
}

function SpecItem({ label, value, unit, copyable = false }: SpecItemProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
      <span className="text-base font-medium text-gray-700">{label}</span>
      <div className="flex items-center space-x-2">
        <span className="text-base font-mono bg-gray-100 px-3 py-1 rounded">
          {value}{unit && <span className="text-gray-500">{unit}</span>}
        </span>
        {copyable && (
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="복사"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-600" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function HandoffSpecs() {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'components' | 'assets'>('colors');

  const colorTokens = [
    { name: '--color-primary-500', value: '#3b82f6', usage: 'Main primary color' },
    { name: '--color-primary-600', value: '#2563eb', usage: 'Primary hover state' },
    { name: '--color-success', value: '#16a34a', usage: 'Success states' },
    { name: '--color-danger', value: '#dc2626', usage: 'Error states' },
    { name: '--color-text-primary', value: '#000000', usage: 'Primary text (21:1 contrast)' },
    { name: '--color-text-secondary', value: '#374151', usage: 'Secondary text (9.2:1 contrast)' },
    { name: '--parkinson-primary', value: '#059669', usage: 'Parkinson theme primary' },
    { name: '--diabetes-primary', value: '#dc2626', usage: 'Diabetes theme primary' },
    { name: '--cataract-primary', value: '#000000', usage: 'Cataract theme primary' },
    { name: '--dementia-primary', value: '#7c3aed', usage: 'Dementia theme primary' }
  ];

  const typographyTokens = [
    { name: 'H1', size: '32px', weight: '600', lineHeight: '1.4', usage: 'Page titles' },
    { name: 'H2', size: '24px', weight: '600', lineHeight: '1.4', usage: 'Section titles' },
    { name: 'Body', size: '18px', weight: '500', lineHeight: '1.6', usage: 'Default body text' },
    { name: 'Body Large', size: '22px', weight: '500', lineHeight: '1.6', usage: 'Large body option' },
    { name: 'Button', size: '18px', weight: '600', lineHeight: '1.4', usage: 'Button text' },
    { name: 'Caption', size: '16px', weight: '400', lineHeight: '1.4', usage: 'Helper text' }
  ];

  const spacingTokens = [
    { name: '--space-2', value: '8px', usage: 'Minimal spacing' },
    { name: '--space-4', value: '16px', usage: 'Small spacing' },
    { name: '--space-6', value: '24px', usage: 'Medium spacing' },
    { name: '--space-8', value: '32px', usage: 'Large spacing' },
    { name: '--space-12', value: '48px', usage: 'XL spacing, touch targets' },
    { name: '--space-16', value: '64px', usage: 'Section spacing' }
  ];

  const componentSpecs = [
    {
      name: 'Button - Primary Large',
      specs: [
        { label: 'Height', value: '56px' },
        { label: 'Padding X', value: '32px' },
        { label: 'Font Size', value: '20px' },
        { label: 'Font Weight', value: '600' },
        { label: 'Border Radius', value: '12px' },
        { label: 'Min Touch Target', value: '48×48px' }
      ]
    },
    {
      name: 'Input Field - Large',
      specs: [
        { label: 'Height', value: '56px' },
        { label: 'Padding X', value: '24px' },
        { label: 'Font Size', value: '20px' },
        { label: 'Border Width', value: '2px' },
        { label: 'Border Radius', value: '12px' },
        { label: 'Focus Ring', value: '4px offset 1px' }
      ]
    },
    {
      name: 'Card - Large Info',
      specs: [
        { label: 'Padding', value: '32px' },
        { label: 'Border Radius', value: '20px' },
        { label: 'Shadow', value: '0 10px 15px -3px rgba(0,0,0,0.1)' },
        { label: 'Border Width', value: '2px' },
        { label: 'Min Height', value: '120px' }
      ]
    }
  ];

  const assetSpecs = [
    { type: 'Icons', format: 'SVG', size: '24×24px, 32×32px', usage: 'UI icons' },
    { type: 'Illustrations', format: 'PNG', size: '2x, 3x', usage: 'Onboarding, empty states' },
    { type: 'App Icon', format: 'PNG', size: '1024×1024px', usage: 'App store' },
    { type: 'Splash Screen', format: 'PNG', size: '390×844px @3x', usage: 'App launch' }
  ];

  const tabs = [
    { id: 'colors' as const, label: '색상', icon: Palette },
    { id: 'typography' as const, label: '타이포그래피', icon: Type },
    { id: 'spacing' as const, label: '간격', icon: Move3D },
    { id: 'components' as const, label: '컴포넌트', icon: Smartphone },
    { id: 'assets' as const, label: '에셋', icon: Download }
  ];

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">개발 핸드오프 가이드</h2>
        <p className="text-lg text-gray-600">
          은평구 고령층 실버모드 앱 개발을 위한 상세 스펙
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 bg-gray-100 p-2 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center space-x-2 px-4 py-3 rounded-md transition-all text-base font-medium',
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'colors' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">컬러 토큰</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {colorTokens.map((color) => (
                <Card key={color.name} variant="outlined" size="medium">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-gray-300"
                        style={{ backgroundColor: color.value }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-base">{color.name}</h4>
                        <p className="text-sm text-gray-600">{color.usage}</p>
                      </div>
                    </div>
                    <SpecItem 
                      label="HEX" 
                      value={color.value} 
                      copyable 
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">타이포그래피 시스템</h3>
            <div className="space-y-4">
              {typographyTokens.map((type) => (
                <Card key={type.name} variant="outlined" size="medium">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{type.name}</h4>
                      <span className="text-sm text-gray-600">{type.usage}</span>
                    </div>
                    <div 
                      className="p-4 bg-gray-50 rounded-lg"
                      style={{ 
                        fontSize: type.size,
                        fontWeight: type.weight,
                        lineHeight: type.lineHeight
                      }}
                    >
                      샘플 텍스트 (가나다라마바사)
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <SpecItem label="Size" value={type.size} copyable />
                      <SpecItem label="Weight" value={type.weight} copyable />
                      <SpecItem label="Line Height" value={type.lineHeight} copyable />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'spacing' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">간격 시스템 (8pt Grid)</h3>
            <div className="space-y-4">
              {spacingTokens.map((space) => (
                <Card key={space.name} variant="outlined" size="medium">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="bg-primary/20 border-l-4 border-primary"
                        style={{ height: '32px', width: space.value }}
                      />
                      <div>
                        <h4 className="font-semibold text-base">{space.name}</h4>
                        <p className="text-sm text-gray-600">{space.usage}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <SpecItem label="Value" value={space.value} copyable />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">컴포넌트 스펙</h3>
            <div className="space-y-6">
              {componentSpecs.map((component) => (
                <Card key={component.name} variant="outlined" size="large">
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold">{component.name}</h4>
                    <div className="space-y-2">
                      {component.specs.map((spec) => (
                        <SpecItem 
                          key={spec.label}
                          label={spec.label}
                          value={spec.value}
                          copyable
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* WCAG Compliance */}
            <Card variant="elevated" size="large" className="bg-green-50 border-green-200">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-green-800">♿ 접근성 체크리스트</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>✅ 본문 텍스트 최소 18px (WCAG AA)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>✅ 버튼 최소 48×48px 터치 타겟</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>✅ 텍스트 대비 4.5:1 이상</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>✅ 키보드 네비게이션 지원</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>✅ 스크린 리더 라벨 제공</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">에셋 익스포트 가이드</h3>
            <div className="space-y-4">
              {assetSpecs.map((asset, index) => (
                <Card key={index} variant="outlined" size="medium">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{asset.type}</h4>
                      <span className="text-sm bg-gray-100 px-3 py-1 rounded">
                        {asset.format}
                      </span>
                    </div>
                    <SpecItem label="Size" value={asset.size} />
                    <SpecItem label="Usage" value={asset.usage} />
                  </div>
                </Card>
              ))}
            </div>

            {/* Export Guidelines */}
            <Card variant="elevated" size="large" className="bg-blue-50 border-blue-200">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-blue-800">📦 익스포트 규칙</h4>
                <div className="space-y-2 text-blue-700">
                  <p>• SVG 아이콘: viewBox="0 0 24 24", 최적화된 패스</p>
                  <p>• PNG 이미지: @2x, @3x 레티나 버전 제공</p>
                  <p>• 앱 아이콘: iOS, Android 각각 요구사항에 맞춰 익스포트</p>
                  <p>• 색상: sRGB 컬러 프로파일 사용</p>
                </div>
              </div>
            </Card>

            {/* Firebase Schema */}
            <Card variant="outlined" size="large">
              <div className="space-y-4">
                <h4 className="text-lg font-bold">🔥 Firebase 데이터 스키마 예시</h4>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`// 복약 알림 객체
{
  "medications": {
    "med_id": {
      "name": "혈압약 (암로디핀)",
      "dosage": "5mg",
      "times": ["08:00", "20:00"],
      "reminders": true,
      "createdAt": "2025-08-22T00:00:00Z"
    }
  },
  
  // 예약 객체
  "appointments": {
    "appt_id": {
      "hospital": "은평구보건소",
      "doctor": "김내과 원장님",
      "date": "2025-08-25",
      "time": "14:30",
      "status": "confirmed"
    }
  }
}`}</pre>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Download Section */}
      <Card variant="elevated" size="large" className="text-center">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">📁 다운로드</h3>
          <div className="flex justify-center space-x-4">
            <Button size="large" variant="primary">
              <Download className="w-5 h-5 mr-2" />
              Figma 파일
            </Button>
            <Button size="large" variant="secondary">
              <Code className="w-5 h-5 mr-2" />
              CSS 토큰
            </Button>
            <Button size="large" variant="secondary">
              <Smartphone className="w-5 h-5 mr-2" />
              에셋 팩
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}