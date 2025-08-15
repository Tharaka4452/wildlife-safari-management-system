import React from 'react';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Kumara Perera",
      role: "Founder & Wildlife Expert",
      description: "With over 15 years of experience in wildlife conservation, Kumara leads our mission to protect Sri Lanka's natural heritage.",
      expertise: "Elephant behavior, Conservation biology",
      image: "👨‍🦱"
    },
    {
      name: "Dr. Anjali Silva",
      role: "Conservation Director",
      description: "A PhD in Wildlife Biology, Dr. Silva oversees our research programs and community education initiatives.",
      expertise: "Research & Monitoring, Community Outreach",
      image: "👩‍🔬"
    },
    {
      name: "Ravi Mendis",
      role: "Safari Guide & Naturalist",
      description: "Born and raised near Yala National Park, Ravi has an intimate knowledge of Sri Lanka's wildlife and ecosystems.",
      expertise: "Bird watching, Photography tours",
      image: "👨‍🦰"
    },
    {
      name: "Priya Fernando",
      role: "Customer Experience Manager",
      description: "Ensuring every guest has an unforgettable and responsible wildlife experience in Sri Lanka.",
      expertise: "Sustainable tourism, Guest relations",
      image: "👩‍💼"
    }
  ];

  const values = [
    {
      title: "Conservation First",
      description: "Every tour is designed to minimize environmental impact while maximizing educational value.",
      icon: "🌱"
    },
    {
      title: "Local Expertise",
      description: "Our team consists of local experts with deep knowledge of Sri Lanka's wildlife and culture.",
      icon: "🏠"
    },
    {
      title: "Sustainable Tourism",
      description: "We promote responsible tourism that benefits both wildlife and local communities.",
      icon: "♻️"
    },
    {
      title: "Authentic Experiences",
      description: "We provide genuine wildlife encounters that respect animals and their natural behaviors.",
      icon: "✨"
    }
  ];

  const achievements = [
    {
      number: "10+",
      label: "Years of Experience",
      description: "Serving wildlife enthusiasts since 2014"
    },
    {
      number: "5,000+",
      label: "Happy Guests",
      description: "From over 50 countries worldwide"
    },
    {
      number: "100%",
      label: "Safety Record",
      description: "Zero incidents in all our tours"
    },
    {
      number: "15+",
      label: "Conservation Projects",
      description: "Actively supporting wildlife protection"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-abeze font-bold text-white mb-4">
            About <span className="text-green-400">Mufasa Wildlife</span>
          </h2>
          <p className="text-gray-300 text-lg font-abeze max-w-3xl mx-auto">
            We are passionate about sharing the wonders of Sri Lankan wildlife while ensuring their protection for future generations.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-3xl font-abeze font-bold text-white mb-6">
              Our Story
            </h3>
            <div className="space-y-4 text-gray-300 font-abeze leading-relaxed">
              <p>
              Founded in 2014, Wild Path was born from a simple yet powerful vision: to create unforgettable journeys that connect people with the breathtaking wildlife of Sri Lanka, while fiercely protecting the wonders we cherish. What began as a humble family-run safari experience has grown into one of the most trusted and respected wildlife tourism companies in the country—yet our heart remains as wild and authentic as the day we started.
              </p>
              <p>
              Our founder, Kumara Perera, grew up in the gentle rhythms and raw beauty of life beside Yala National Park. From the distant call of a peacock at dawn to the quiet footsteps of an elephant at dusk, these moments became part of his soul. His deep respect for nature shapes everything we do, guiding us toward a model of conservation-led, responsible tourism that protects what we love most.
              </p>
              <p>
              Today, Wild Path is more than just safaris—it’s a bridge between people and the wild. We collaborate with local communities, conservationists, and government agencies to ensure every journey leaves a positive footprint. Our guests don’t just witness Sri Lanka’s wildlife; they become part of a story that helps preserve it for generations to come.
              </p>
              <p>From the misty highlands to the golden coastal plains, we invite you to walk the wild path with us—where every adventure tells a story, and every story leaves the wild a little stronger.</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-green-400/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/30">
            <h4 className="text-2xl font-abeze font-bold text-white mb-4">Our Mission</h4>
            <p className="text-gray-300 font-abeze mb-6">
              To provide authentic, educational, and sustainable wildlife experiences that inspire conservation 
              while supporting local communities and protecting Sri Lanka's natural heritage.
            </p>
            <h4 className="text-2xl font-abeze font-bold text-white mb-4">Our Vision</h4>
            <p className="text-gray-300 font-abeze">
              A world where wildlife tourism serves as a powerful tool for conservation, education, and 
              sustainable development, ensuring Sri Lanka's natural wonders thrive for generations to come.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-abeze font-bold text-white text-center mb-12">
            Our <span className="text-green-400">Values</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="text-4xl mb-4 text-center">
                  {value.icon}
                </div>
                <h4 className="text-xl font-abeze font-bold text-white mb-3 text-center">
                  {value.title}
                </h4>
                <p className="text-gray-300 font-abeze text-sm text-center leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-abeze font-bold text-white text-center mb-12">
            Meet Our <span className="text-green-400">Team</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="text-6xl mb-4 text-center">
                  {member.image}
                </div>
                <h4 className="text-xl font-abeze font-bold text-white mb-2 text-center">
                  {member.name}
                </h4>
                <p className="text-green-400 font-abeze text-sm text-center mb-3">
                  {member.role}
                </p>
                <p className="text-gray-300 font-abeze text-sm text-center mb-3 leading-relaxed">
                  {member.description}
                </p>
                <div className="bg-green-600/20 text-green-400 px-3 py-1 rounded-lg text-center">
                  <span className="font-abeze font-medium text-xs">{member.expertise}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-abeze font-bold text-white text-center mb-12">
            Our <span className="text-green-400">Achievements</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className="text-center bg-gradient-to-br from-green-600/20 to-green-400/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30"
              >
                <div className="text-4xl font-abeze font-bold text-green-400 mb-2">
                  {achievement.number}
                </div>
                <h4 className="text-xl font-abeze font-bold text-white mb-2">
                  {achievement.label}
                </h4>
                <p className="text-gray-300 font-abeze text-sm">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600/20 to-green-400/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/30">
            <h3 className="text-2xl font-abeze font-bold text-white mb-4">
              Ready to Experience Sri Lankan Wildlife?
            </h3>
            <p className="text-gray-300 font-abeze mb-6 max-w-2xl mx-auto">
              Join us on an unforgettable journey through Sri Lanka's most pristine wildlife sanctuaries. 
              Let our expert guides show you the magic of the island's natural wonders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-abeze font-bold transition-colors duration-300">
                Book Your Safari
              </button>
              <button className="bg-transparent border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-8 py-3 rounded-full font-abeze font-bold transition-all duration-300">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs; 