import { MessageCircle, ChevronUp, ChevronDown } from "lucide-react";
import { FunctionComponent, useState } from "react";
import { Answer, Thread } from "@/app/api/search/route";

// Interface to handle passing down thread object
interface ThreadProps {
    thread: Thread
}

/**
 * ThreadItem component, handles displaying the thread information
 * @param param0 
 * @returns 
 */
const ThreadItem: FunctionComponent<ThreadProps> = ({ thread }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 animate-slideInTop">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h3 className="text-xl font-semibold text-blue-800">{thread.title}</h3>
                <div className="flex items-center">
                    <span className="text-gray-500 mr-2">
                        <MessageCircle size={16} />
                        {thread.answers.length}
                    </span>
                <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-0' : 'rotate-180'}`}>
                {<ChevronUp size={20} />}
                </div>
                </div>
            </div>
            {isExpanded && (
                <div className="mt-4 space-y-4">
                    {thread.answers.map((answer, index) => (
                        <AnswerItem key={index} answer={answer} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ThreadItem;

// Interface to handle passing down answer object
interface AnswerProps {
    answer: Answer
}

/**
 * A component to show a single answer
 * @returns FunctionComponent describing the answer layout
 */
const AnswerItem: FunctionComponent<AnswerProps> = ({ answer }) => {
    return (
        <div className="bg-blue-50 rounded p-3">
            <p className="text-sm font-semibold text-blue-600 mb-1">{answer.user}</p>
            <p className="text-gray-700">{answer.content}</p>
        </div>
    )
}

