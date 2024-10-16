/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config) => {
		config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "utfs.io",
			},
			{
				protocol: "https",
				hostname: "*.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "loremflickr.com",
			},
			{
				protocol: "https",
				hostname: "picsum.photos",
			},
		],
	},
};

export default nextConfig;
