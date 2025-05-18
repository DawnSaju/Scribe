"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client"; 
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Onboarding() {
    const [step, setStep] = useState(1);
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [learningGoal, setLearningGoal] = useState<string | null>(null);
    const [dailyTime, setDailyTime] = useState<string | null>(null);
    const [proficiencyLevel, setProficiencyLevel] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    
    const goals = [
        { name: "Improve vocabulary", description: "Expand your word knowledge naturally", icon: "📚" },
        { name: "Prep for exams", description: "TOEFL, IELTS, and other tests", icon: "📝" },
        { name: "Learn through shows", description: "Casual learning while watching", icon: "🎬" },
        { name: "Build habit", description: "Daily learning routine", icon: "⏰" },
    ];

    const timeOptions = [
        { value: "5", label: "5 minutes/day" },
        { value: "10", label: "10 minutes/day" },
        { value: "15", label: "15 minutes/day" },
        { value: "custom", label: "Custom" },
    ];

    const levels = [
        { value: "beginner", label: "Beginner", description: "I'm just starting out" },
        { value: "intermediate", label: "Intermediate", description: "I can handle everyday conversations" },
        { value: "advanced", label: "Advanced", description: "I want to master complex vocabulary" },
    ];

    const platforms = [
        { name: "Netflix", description: "Learn from your favorite shows", icon: "📺" },
        { name: "YouTube", description: "Educational content and tutorials", icon: "🎥" },
        { name: "Prime Video", description: "Movies and series", icon: "🎬" },
    ];

    const validateStep = () => {
        switch (step) {
            case 2:
                if (!learningGoal) {
                    setError("Please select a learning goal");
                    return false;
                }
                break;
            case 3:
                if (!dailyTime || !proficiencyLevel) {
                    setError("Please complete all fields");
                    return false;
                }
                break;
            case 4:
                if (!selectedPlatform) {
                    setError("Please select a platform");
                    return false;
                }
                break;
        }
        setError(null);
        return true;
    };

    const handleNextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const handleBackStep = () => {
        setStep(step - 1);
        setError(null);
    };

    const submitButton = async () => {
        if (!selectedPlatform || !learningGoal || !dailyTime || !proficiencyLevel) {
            setError("Please complete all onboarding steps");
            return;
        }

        const { error: metadataError } = await supabase.auth.updateUser({
            data: { has_onboarded: true },
        });

        if (metadataError) {
            console.error("Failed to update user metadata:", metadataError.message);
            return;
        }

        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user?.id) {
            console.error("Failed to get current user:", userError?.message);
            return;
        }

        const { error: insertError } = await supabase.from('onboarding').upsert({
            id: userData.user.id,
            selected_platform: selectedPlatform,
            learning_goal: learningGoal,
            daily_time: dailyTime,
            proficiency_level: proficiencyLevel,
        });

        if (insertError) {
            console.error("Failed to insert onboarding data:", insertError.message);
            return;
        }

        router.push("/dashboard");
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="mx-auto flex flex-col items-center space-y-6 text-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                Welcome to Scribe
                            </h1>
                            <p className="text-muted-foreground max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Learn vocabulary as you watch. Turn any subtitle into an
                                interactive learning experience.
                            </p>
                        </div>
                        <Button onClick={() => setStep(2)} size="lg">
                            Get Started
                        </Button>
                    </div>
                );

            case 2:
                return (
                    <div className="mx-auto flex flex-col items-center space-y-6 max-w-2xl">
                        <div className="space-y-2 text-center">
                            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                                What brings you to Scribe?
                            </h2>
                            <p className="text-muted-foreground">
                                Help us personalize your learning experience
                            </p>
                        </div>
                        {error && (
                            <Alert variant="destructive" className="w-full">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="w-full space-y-4">
                            {goals.map((goal, i) => (
                                <Button
                                    key={i}
                                    onClick={() => setLearningGoal(goal.name)}
                                    variant={learningGoal === goal.name ? "default" : "outline"}
                                    className="w-full justify-start h-auto p-4"
                                >
                                    <div className="flex items-center space-x-4 w-full">
                                        <div className="text-2xl">{goal.icon}</div>
                                        <div className="flex-1 text-left">
                                            <h3 className="font-semibold">{goal.name}</h3>
                                            <p className={`text-sm ${learningGoal === goal.name ? "text-muted" : "text-muted-foreground"}`}>
                                                {goal.description}
                                            </p>
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                        <div className="flex gap-4 w-full">
                            <Button variant="outline" onClick={handleBackStep}>
                                Back
                            </Button>
                            <Button onClick={handleNextStep} disabled={!learningGoal}>
                                Continue
                            </Button>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="mx-auto flex flex-col items-center space-y-6 max-w-2xl">
                        <div className="space-y-2 text-center">
                            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                                Your Learning Style
                            </h2>
                            <p className="text-muted-foreground">
                                Let&apos;s customize your learning experience
                            </p>
                        </div>
                        {error && (
                            <Alert variant="destructive" className="w-full">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="w-full space-y-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium leading-none">
                                    Daily learning time
                                </Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {timeOptions.map((option, i) => (
                                        <Button
                                            key={i}
                                            onClick={() => setDailyTime(option.value)}
                                            variant={dailyTime === option.value ? "default" : "outline"}
                                            className="w-full h-auto p-4"
                                        >
                                            {option.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium leading-none">
                                    Your current level
                                </Label>
                                <div className="space-y-2">
                                    {levels.map((level, i) => (
                                        <Button
                                            key={i}
                                            onClick={() => setProficiencyLevel(level.value)}
                                            variant={proficiencyLevel === level.value ? "default" : "outline"}
                                            className="w-full justify-start h-auto p-4"
                                        >
                                            <div className="flex-1 text-left">
                                                <h3 className="font-semibold">{level.label}</h3>
                                                <p className={`text-sm ${proficiencyLevel === level.value ? "text-muted" : "text-muted-foreground"}`}>
                                                    {level.description}
                                                </p>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 w-full">
                            <Button variant="outline" onClick={handleBackStep}>
                                Back
                            </Button>
                            <Button onClick={handleNextStep} disabled={!dailyTime || !proficiencyLevel}>
                                Continue
                            </Button>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="mx-auto flex flex-col items-center space-y-6 max-w-2xl">
                        <div className="space-y-2 text-center">
                            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                                Choose Your Platform
                            </h2>
                            <p className="text-muted-foreground">
                                Where do you watch most of your content?
                            </p>
                        </div>
                        {error && (
                            <Alert variant="destructive" className="w-full">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="w-full space-y-4">
                            {platforms.map((platform, i) => (
                                <Button
                                    key={i}
                                    onClick={() => setSelectedPlatform(platform.name)}
                                    variant={selectedPlatform === platform.name ? "default" : "outline"}
                                    className="w-full justify-start h-auto p-4"
                                >
                                    <div className="flex items-center space-x-4 w-full">
                                        <div className="text-2xl">{platform.icon}</div>
                                        <div className="flex-1 text-left">
                                            <h3 className="font-semibold">{platform.name}</h3>
                                            <p className={`text-sm ${selectedPlatform === platform.name ? "text-muted" : "text-muted-foreground"}`}>
                                                {platform.description}
                                            </p>
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                        <div className="flex gap-4 w-full">
                            <Button variant="outline" onClick={handleBackStep}>
                                Back
                            </Button>
                            <Button onClick={handleNextStep} disabled={!selectedPlatform}>
                                Continue
                            </Button>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="mx-auto flex flex-col items-center space-y-6 text-center max-w-2xl">
                        <div className="text-2xl">🎉</div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                                You&apos;re All Set!
                            </h2>
                            <p className="text-muted-foreground">
                                Your personalized learning experience is ready. Let&apos;s start
                                learning!
                            </p>
                        </div>
                        {error && (
                            <Alert variant="destructive" className="w-full">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button onClick={submitButton} size="lg">
                            Go to Dashboard
                        </Button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container relative h-full flex flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
                <div className="px-4 py-12 w-full">{renderStep()}</div>
            </div>
        </div>
    );
}