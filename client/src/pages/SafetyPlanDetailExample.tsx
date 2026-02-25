import React from 'react';
import SafetyPlanDetail from '../components/SafetyPlanDetail';
import { Shield, AlertTriangle, HardHat, Eye, Zap, Users } from 'lucide-react';

export default function SafetyPlanDetailExample() {
    // Sample data based on the HTML structure
    const sampleData = {
        title: "Daily Safety Plan - Production Line A",
        status: "Active" as const,
        date: "2024-01-15",
        shift: "Morning Shift",
        location: "Production Floor A",
        machine: "Assembly Line 1",
        group: "Team Alpha",

        safetyConcerns: [
            {
                id: "1",
                title: "Specialized Training",
                icon: <Shield className="w-4 h-4" />,
                color: "teal"
            },
            {
                id: "2",
                title: "PPE Required",
                icon: <HardHat className="w-4 h-4" />,
                color: "teal"
            },
            {
                id: "3",
                title: "Fall Hazard",
                icon: <AlertTriangle className="w-4 h-4" />,
                color: "teal"
            },
            {
                id: "4",
                title: "Electrical Risk",
                icon: <Zap className="w-4 h-4" />,
                color: "teal"
            },
            {
                id: "5",
                title: "Supervision Required",
                icon: <Eye className="w-4 h-4" />,
                color: "teal"
            }
        ],

        hazards: [
            {
                id: "1",
                title: "+35lb Manual Lifts",
                riskLevel: "HIGH RISK" as const,
                description: "Manual lifting of heavy components exceeding 35lbs without mechanical assistance",
                mitigationPlan: "Use mechanical lifting equipment for all loads over 25lbs. Team lifting protocol for loads 25-35lbs. Training on proper lifting techniques."
            },
            {
                id: "2",
                title: "Work at Heights",
                riskLevel: "HIGH RISK" as const,
                description: "Working on elevated platforms and ladders for equipment maintenance",
                mitigationPlan: "Fall protection harness required for all work above 6 feet. Guardrails must be in place. Spotter required for ladder work."
            }
        ],

        signOffs: [
            {
                id: "1",
                role: "Safety Officer",
                name: "John Smith",
                date: "2024-01-15 08:00"
            },
            {
                id: "2",
                role: "Team Lead",
                name: "Sarah Johnson",
                date: "2024-01-15 08:15"
            },
            {
                id: "3",
                role: "Supervisor",
                name: "Mike Davis",
                date: "2024-01-15 08:30"
            }
        ]
    };

    return (
        <SafetyPlanDetail {...sampleData} />
    );
}