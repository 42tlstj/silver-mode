/**
 * 02_Components: Disease-Specific Component Variants
 * 목적: 파킨슨병, 당뇨병, 백내장, 치매 등 질환별 특화 컴포넌트
 */

import React, { useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { TTSButton } from './AccessibilityControls';
import { cn } from '../ui/utils';
import { 
  Activity, 
  TrendingUp, 
  Eye, 
  Brain, 
  AlertTriangle,
  Check,
  X,
  Phone,
  Undo2
} from 'lucide-react';

// 파킨슨병 특화 컴포넌트
export function ParkinsonButton({ children, onUndo, ...props }: any) {
  const [showUndo, setShowUndo] = useState(false);

  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
      setShowUndo(true);
      // 5초 후 Undo 옵션 숨김
      setTimeout(() => setShowUndo(false), 5000);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        {...props}
        size="parkinson" // 60x60 이상
        onClick={handleClick}
        className="text-2xl font-bold"
      >
        {children}
      </Button>
      
      {showUndo && (
        <Button
          variant="secondary"
          size="large"
          onClick={() => {
            onUndo?.();
            setShowUndo(false);
          }}
          className="w-full"
        >
          <Undo2 className="w-6 h-6 mr-3" />
          실행 취소
        </Button>
      )}
    </div>
  );
}

export function ParkinsonCard({ title, children, ...props }: any) {
  return (
    <Card
      {...props}
      size="xl"
      className="border-4 border-green-200 bg-green-50 p-8"
    >
      <div className="space-y-6">
        {title && (
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-green-900">{title}</h3>
            <TTSButton text={title} variant="primary" size="large" />
          </div>
        )}
        <div className="text-xl leading-relaxed">
          {children}
        </div>
      </div>
    </Card>
  );
}

// 당뇨병 특화 컴포넌트
interface GlucoseWidgetProps {
  value: number;
  target: { min: number; max: number };
  timestamp: string;
  onQuickInput: (value: number) => void;
}

export function GlucoseWidget({ value, target, timestamp, onQuickInput }: GlucoseWidgetProps) {
  const isInRange = value >= target.min && value <= target.max;
  const isHigh = value > target.max;
  const isLow = value < target.min;

  const quickValues = [80, 100, 120, 140, 160, 180, 200, 250];

  return (
    <Card 
      variant="elevated" 
      size="large"
      className={cn(
        'border-4',
        isInRange && 'border-green-300 bg-green-50',
        isHigh && 'border-red-300 bg-red-50',
        isLow && 'border-yellow-300 bg-yellow-50'
      )}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">혈당 수치</h3>
          <TTSButton text={`현재 혈당 수치는 ${value} mg/dL 입니다`} />
        </div>

        <div className="text-center space-y-2">
          <div className="text-6xl font-bold text-red-600">
            {value}
          </div>
          <div className="text-xl text-gray-600">mg/dL</div>
          <div className="text-lg text-gray-500">{timestamp}</div>
        </div>

        <div className={cn(
          'p-4 rounded-lg text-center text-xl font-semibold',
          isInRange && 'bg-green-100 text-green-800',
          isHigh && 'bg-red-100 text-red-800',
          isLow && 'bg-yellow-100 text-yellow-800'
        )}>
          {isInRange && '✓ 정상 범위'}
          {isHigh && '⚠️ 높음 - 주의 필요'}
          {isLow && '⚠️ 낮음 - 주의 필요'}
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-semibold">빠른 입력</h4>
          <div className="grid grid-cols-4 gap-3">
            {quickValues.map((val) => (
              <Button
                key={val}
                variant="secondary"
                size="medium"
                onClick={() => onQuickInput(val)}
                className="text-lg"
              >
                {val}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// 백내장 특화 컴포넌트
export function CataractButton({ children, ...props }: any) {
  return (
    <Button
      {...props}
      size="xl"
      className={cn(
        "text-3xl font-black border-4 border-black bg-white text-black",
        "hover:bg-gray-100 focus:ring-4 focus:ring-black/20",
        props.className
      )}
    >
      {children}
    </Button>
  );
}

export function CataractCard({ title, children, ...props }: any) {
  return (
    <Card
      {...props}
      size="xl"
      className="border-4 border-black bg-white"
    >
      <div className="space-y-6">
        {title && (
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-black">{title}</h3>
            <TTSButton text={title} variant="primary" size="large" />
          </div>
        )}
        <div className="text-2xl font-bold leading-relaxed text-black">
          {children}
        </div>
      </div>
    </Card>
  );
}

// 치매 특화 컴포넌트
interface RoutineCardProps {
  title: string;
  tasks: Array<{ id: string; text: string; completed: boolean }>;
  onToggleTask: (taskId: string) => void;
  caregiverAlert?: boolean;
}

export function RoutineCard({ title, tasks, onToggleTask, caregiverAlert }: RoutineCardProps) {
  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <Card 
      variant="elevated" 
      size="large"
      className="border-4 border-purple-200 bg-purple-50"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-purple-900">{title}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-purple-700">
              {completedCount}/{totalCount}
            </span>
            {caregiverAlert && (
              <button className="p-2 bg-orange-500 text-white rounded-full">
                <Phone className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {tasks.slice(0, 3).map((task) => ( // 최대 3개만 표시
            <div 
              key={task.id}
              className={cn(
                'flex items-center space-x-4 p-4 rounded-lg border-2 transition-all',
                task.completed 
                  ? 'bg-green-100 border-green-300' 
                  : 'bg-white border-purple-200'
              )}
            >
              <button
                onClick={() => onToggleTask(task.id)}
                className={cn(
                  'flex-shrink-0 w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all',
                  task.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'bg-white border-purple-300 hover:border-purple-500'
                )}
              >
                {task.completed && <Check className="w-6 h-6" />}
              </button>
              <span className={cn(
                'text-xl font-medium flex-1',
                task.completed 
                  ? 'text-green-800 line-through' 
                  : 'text-purple-900'
              )}>
                {task.text}
              </span>
              <TTSButton text={task.text} size="medium" />
            </div>
          ))}
        </div>

        {totalCount > 3 && (
          <div className="text-center">
            <Button variant="secondary" size="large">
              모든 일정 보기 ({totalCount - 3}개 더)
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

// 질환별 컴포넌트 쇼케이스
export function DiseaseSpecificShowcase() {
  const [glucoseValue, setGlucoseValue] = useState(145);
  const [routineTasks, setRoutineTasks] = useState([
    { id: '1', text: '아침 약 복용', completed: true },
    { id: '2', text: '혈압 측정', completed: false },
    { id: '3', text: '산책하기', completed: false },
    { id: '4', text: '점심 식사', completed: false },
    { id: '5', text: '오후 약 복용', completed: false }
  ]);

  const toggleTask = (taskId: string) => {
    setRoutineTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="p-8 space-y-12">
      <h2 className="text-2xl font-bold mb-6">질환별 특화 컴포넌트</h2>
      
      {/* 파킨슨병 */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-green-700">파킨슨병 전용 컴포넌트</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ParkinsonCard title="오늘의 운동">
            <div className="space-y-4">
              <p>떨림 완화 운동을 시작해보세요</p>
              <ParkinsonButton 
                variant="primary"
                onUndo={() => alert('운동 취소됨')}
              >
                운동 시작
              </ParkinsonButton>
            </div>
          </ParkinsonCard>
          
          <ParkinsonCard title="복약 알림">
            <div className="space-y-4">
              <p>레보도파 복용 시간입니다</p>
              <ParkinsonButton 
                variant="primary"
                onUndo={() => alert('복용 취소됨')}
              >
                복용 완료
              </ParkinsonButton>
            </div>
          </ParkinsonCard>
        </div>
      </div>

      {/* 당뇨병 */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-red-700">당뇨병 전용 컴포넌트</h3>
        
        <GlucoseWidget
          value={glucoseValue}
          target={{ min: 80, max: 140 }}
          timestamp="2025년 8월 22일 오후 2:30"
          onQuickInput={(value) => {
            setGlucoseValue(value);
            alert(`혈당 ${value} mg/dL로 기록됨`);
          }}
        />
      </div>

      {/* 백내장 */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">백내장 전용 컴포넌트 (고대비)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CataractCard title="다음 진료">
            <div className="space-y-4">
              <p>안과 검진 예약이 있습니다</p>
              <p>8월 25일 오후 3시</p>
              <CataractButton>
                예약 확인
              </CataractButton>
            </div>
          </CataractCard>
          
          <CataractCard title="시력 관리">
            <div className="space-y-4">
              <p>인공눈물 점안 시간입니다</p>
              <CataractButton>
                점안 완료
              </CataractButton>
            </div>
          </CataractCard>
        </div>
      </div>

      {/* 치매 */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-purple-700">치매 전용 컴포넌트</h3>
        
        <RoutineCard
          title="오늘의 일정"
          tasks={routineTasks}
          onToggleTask={toggleTask}
          caregiverAlert={routineTasks.filter(t => !t.completed).length > 3}
        />
      </div>
    </div>
  );
}