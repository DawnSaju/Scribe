import { RiNetflixFill, RiStarSFill } from "@remixicon/react";
import { EllipsisIcon, LucideTv2, Stars } from "lucide-react";

export default function Concept(){
    return (
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center min-h-screen">
            <div className="flex flex-col w-[500px] h-[700px] rounded-4xl shadow-lg hover:shadow-xl transition-all">
                <div className="w-[500px] h-[300px] rounded-4xl bg-cover bg-center bg-no-repeat bg-[url('https://m.media-amazon.com/images/M/MV5BMjg2NmM0MTEtYWY2Yy00NmFlLTllNTMtMjVkZjEwMGVlNzdjXkEyXkFqcGc@._V1_SX300.jpg')]">
                    <div className="flex justify-between items-start h-24 p-4">
                        <div className="flex flex-row justify-center items-center gap-4 w-32 h-10 rounded-full bg-white">
                            <LucideTv2 className="w-6 h-6"></LucideTv2>
                            <h1 className="font-['DM Sans'] font-bold text-xl">S1-E2</h1>
                        </div>
                        <div className="flex justify-center items-center p-2 rounded-lg bg-white">
                            <RiNetflixFill className="w-8 h-8 text-red-600"></RiNetflixFill>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col p-8 gap-4">
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="text-black font-['DM Sans'] font-semibold text-4xl">word</h1>
                        <div className="p-2 rounded-full hover:bg-black/5 transition-all">
                            <EllipsisIcon className="w-8 h-8"></EllipsisIcon>
                        </div>
                    </div>
                    <h2 className="text-black font-['DM Sans'] text-xl opacity-50">Parts of speech</h2>
                    <div className="flex flex-col gap-6 pt-4">
                        <h2 className="text-black font-['DM Sans'] text-xl opacity-45">Definition</h2>
                        <div className="flex justify-center items-center gap-4 w-full">
                            <div className="w-full ml-8">
                                <h2 className="text-black font-['DM Sans'] font-medium text-xl opacity-50">“This is an example sentence using this word.”</h2>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-between items-center gap-8 pt-14">
                        <h2 className="text-black font-['DM Sans'] font-bold text-xl opacity-60">Stranger Things</h2>
                        <h2 className="text-black font-['DM Sans'] text-xl opacity-60">May 22</h2>
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-[500px] h-[700px] rounded-4xl shadow-lg hover:shadow-xl transition-all">
                <img src={"https://picsum.photos/1920/2690"} className="absolute w-[500px] object-cover rounded-4xl -z-1 hidden">
                    
                </img>
                <div className="absolute w-[500px] h-[400px] bg-black/60 blur-3xl rounded-4xl bottom-30 -z-1 hidden">

                </div>
                <div className="flex flex-col justify-end h-full p-8 gap-6">
                    <div className="flex flex-col justify-end h-full gap-2">
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="text-black font-['DM Sans'] font-semibold text-4xl">Santorini Villa</h1>
                        <div className="p-2 rounded-full hover:bg-black/5 transition-all">
                            <EllipsisIcon className="w-8 h-8"></EllipsisIcon>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 pt-4">
                            <div className="flex justify-center items-center gap-4 w-full">
                                <div className="w-full">
                                    <h2 className="text-black/50 font-['DM Sans'] font-medium text-xl">Lorem Ipsum is simply dummy text of the printing and typesetting industry lorem Ipsum has been the industry's standard dummy text</h2>
                                </div>
                            </div>
                    </div>
                </div>
                    <div className="flex flex-row gap-4 justify-start items-start h-24">
                        <div className="flex flex-row justify-center items-center gap-4 h-10 p-4 rounded-full bg-[linear-gradient(180deg,_#505357_0%,_#504D4D_100%)]">
                            <h1 className="font-['DM Sans'] font-bold text-xl text-white/40">4.5</h1>
                            <div className="flex flex-row justify-center items-center h-10 text-white/80 rounded-full bg-[linear-gradient(180deg,_#505357_0%,_#504D4D_100%)]">
                                <RiStarSFill className="w-5 h-5"/>
                                <RiStarSFill className="w-5 h-5"/>
                                <RiStarSFill className="w-5 h-5"/>
                                <RiStarSFill className="w-5 h-5"/>
                                <RiStarSFill className="w-5 h-5"/>
                            </div>
                        </div>
                         <div className="flex flex-row justify-center items-center gap-4 h-10 p-4 rounded-full bg-[linear-gradient(180deg,_#505357_0%,_#504D4D_100%)]">
                            <h1 className="font-['DM Sans'] font-regular text-md text-white/40">3 Night Stay</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-[500px] h-[700px] bg-[linear-gradient(180deg,_#2D2F32_0%,_#323232_100%)] rounded-4xl shadow-lg hover:shadow-xl transition-all">
                <div className="w-[500px] h-[300px] rounded-4xl">
                    <div className="flex justify-between items-start h-24 p-4">
                        <div className="flex flex-row justify-center items-center gap-4 w-32 h-10 rounded-full bg-[linear-gradient(180deg,_#505357_0%,_#504D4D_100%)]">
                            <LucideTv2 className="w-6 h-6 text-white/40"></LucideTv2>
                            <h1 className="font-['DM Sans'] font-bold text-xl text-white/40">S1-E2</h1>
                        </div>
                        <div className="flex justify-center items-center p-2 rounded-lg bg-[linear-gradient(180deg,_#505357_0%,_#504D4D_100%)]">
                            <RiNetflixFill className="w-8 h-8 text-red-600"></RiNetflixFill>
                        </div>
                    </div>
                    <div className="flex flex-col p-8 gap-4">
                        <div className="flex flex-row justify-between items-center">
                            <h1 className="text-white font-['DM Sans'] font-semibold text-5xl">word</h1>
                            <div className="pr-8 flex justify-center items-starttransition-all">
                                <h1 className="text-white/40 font-sans font-regular text-4xl">/wɜːd/</h1>
                            </div>
                        </div>
                        <h2 className="text-white/50 font-['DM Sans'] text-xl">Parts of speech</h2>
                        <div className="flex flex-col gap-6 pt-4">
                            <h2 className="text-white/45 font-['DM Sans'] text-xl">Description</h2>
                            <div className="flex justify-center items-center gap-4 w-full">
                                <div className="w-full">
                                    <h2 className="text-white/50 font-['DM Sans'] font-medium text-xl">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</h2>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6 pt-4">
                            <h2 className="text-white/45 font-['DM Sans'] text-xl">Translations</h2>
                            <div className="flex justify-center items-center gap-5 w-full">
                                <h2 className="text-white/60 font-sans text-3xl">كلمة</h2>
                                <h2 className="text-white/60 font-sans text-3xl">काम</h2>
                                <h2 className="text-white/60 font-sans text-3xl">சொல்</h2>
                                <h2 className="text-white/60 font-sans text-3xl">单词</h2>
                                <h2 className="text-white/60 font-sans text-3xl">слово</h2>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center gap-8 pt-20">
                            <h2 className="text-white/60 font-['DM Sans'] font-medium text-xl">Stranger Things</h2>
                            <h2 className="text-white/60 font-['DM Sans'] text-xl">May 22</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

