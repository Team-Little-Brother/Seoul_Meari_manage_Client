interface AiAnalysisResultProps {
    complaintData: any;
}

const AiAnalysisResult = ({ complaintData }: AiAnalysisResultProps) => {
    // 위험도에 따른 객체 및 위험 요소 매핑
    const getAnalysisData = (tag: string) => {
        console.log(tag);
        const analysisMap: { [key: string]: any } = {
            'slp': {
                objects: ['종이', '비닐봉투', '쓰레기'],
                risks: ['차량 안전 위험', '보행자 위험', '교통 지연'],
                recommendations: ['긴급 보수', '교통 통제', '정기 점검']
            },
            'sld': {
                objects: ['페트병', '무단 투기', '캔'],
                risks: ['시각적 피해', '재산 손상', '환경 오염'],
                recommendations: ['제거 작업', '감시 강화', '예방 조치']
            }
        };
        return analysisMap[tag] || {
            objects: ['미분류 객체'],
            risks: ['위험 요소 분석 중'],
            recommendations: ['조치 방안 검토 중']
        };
    };

    return (
        <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <SparklesIcon />
                <span className="ml-2">AI 분석 결과</span>
            </h3>

            <div className="mt-4 space-y-4">
                {/* 감지된 객체 */}
                <div>
                    <h4 className="font-semibold text-gray-800">감지된 객체</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {getAnalysisData(complaintData.tag).objects.map((object: string, index: number) => (
                            <span key={index} className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-800">
                                {object}
                            </span>
                        ))}
                    </div>
                </div>
                
                {/* 위험 요소 */}
                <div>
                    <h4 className="font-semibold text-gray-800">위험 요소</h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                        <span className="ml-2">{complaintData.danger}</span>
                    </ul>
                </div>

                {/* 권장 조치 */}
                <div>
                    <h4 className="font-semibold text-gray-800">권장 조치</h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                        <span className="ml-2">{complaintData.solution}</span>
                    </ul>
                </div>
                
            </div>
        </div>
    );
};

// Icons
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;

export default AiAnalysisResult;
