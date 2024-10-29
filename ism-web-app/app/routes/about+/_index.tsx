import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import liveWiseImage from "~/assets/home/14.jpg";

export const loader: LoaderFunction = async () => {
    const contactInfo = {
        phone: "0956 673 9577",
        email: "livewiseofficial@gmail.com",
    };
    const companyInfo = {
        name: "Livewise Construction OPC",
        description: `Livewise Construction OPC., is a registered company that creates high quality, yet affordable services for Filipino and Foreign Clients. Offering design & build services such as design concept, architectural, engineering works, renovation & restoration works, interior fit-outs and furniture supply.
        Aside from company's trademark affordable high quality product and services with great results, LIVEWISE advocates and commits to participate in the growth of the Philippine economy by providing jobs to other person.
        Our staff consisting of highly trained and professional architects, engineers, office staff, foreman, skilled & non-skilled workers. They are dedicated in the industry and providing each of every including our clients and supplier with honest to goodness services.`,
    };
    return json({ contactInfo, companyInfo });
};

export default function About() {
    const { contactInfo, companyInfo } = useLoaderData<{
        contactInfo: { phone: string; email: string };
        companyInfo: { name: string; description: string };
    }>();

    return (
        <div className="flex justify-center items-center bg-gray-100 p-8">
            <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden p-6">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">About Us</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <img 
                        src={liveWiseImage} 
                        alt="Live Wise Construction" 
                        className="w-auto h-[180px] md:h-[250px] object-cover rounded-lg shadow-md" 
                    />
                    <div className="bg-gray-50 rounded-lg p-6 flex flex-col justify-center">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">{companyInfo.name}</h2>
                        <p className="text-gray-600 leading-relaxed text-justify">{companyInfo.description}</p>
                    </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Contact Info</h3>
                    <p className="text-gray-600 mb-2"><strong>Phone:</strong> {contactInfo.phone}</p>
                    <p className="text-gray-600 mb-4"><strong>Email:</strong> {contactInfo.email}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="https://www.facebook.com/LivewiseConstruction" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Facebook
                        </a>
                        <a href="https://livewiseconstruction.com/home" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Website
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
