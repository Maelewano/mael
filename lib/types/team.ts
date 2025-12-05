export interface TeamMember {
    name: string;
    title: string;
    bio: string;
    imageUrl: string;
    linkedinUrl: string;
    location: string;
}

export const teamMembers: TeamMember[] = [
    {
        name: "Primus C Kabuo",
        title: "Lead Developer - Mael",
        bio: "Research Software Engineer",
        imageUrl: "/images/team/primus.jpeg",
        linkedinUrl: "https://www.linkedin.com/in/chimdia-primus-kabuo/",
        location: "Indianapolis, Indiana, USA",
    },
    {
        name: "Michael K Nwokocha",
        title: "Developer & Tester - Mael",
        bio: "Full Stack Developer",
        imageUrl: "/images/team/micheal.jpeg",
        linkedinUrl: "https://www.linkedin.com/in/kesiride-nwokocha-78a30959/",
        location: "Austin, Texas, USA",
    }
];