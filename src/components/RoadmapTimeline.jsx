import React from "react";
import { Timeline, Card, Tag } from "antd";

const RoadmapTimeline = ({ roadmap }) => {
    console.log(roadmap)
    return (
        <Timeline mode="left">
            {roadmap?.roadmap?.map((step) => (
                <Timeline.Item
                    key={step.phase}
                    label={`Phase ${step.phase}`}
                    color="blue"
                >
                    <Card className="m-4 drop-shadow-lg"
                        title={step.topic}
                        extra={<Tag color="purple">{step.estimated_duration_weeks} weeks</Tag>}
                    >
                        <div>
                            <strong>Subtopics:</strong>
                            <ul>
                                {step.subtopics.map((sub, idx) => (
                                    <li key={idx}>{sub}</li>
                                ))}
                            </ul>
                        </div>
                        <br />
                        <div>
                            <strong>Resources:</strong>
                            <ul>
                                {step.resources.map((res, idx) => (
                                    <li key={idx}>
                                        <a href={res.url} target="_blank" rel="noopener noreferrer">
                                            {res.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Card>
                </Timeline.Item>
            ))}
        </Timeline>
    )
}

export default RoadmapTimeline