const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const { MailerSend } = require("mailersend");

const mailersend = new MailerSend({
	api_key: process.env.MAIL_KEY || "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMmM4MGFhZTJmYTA4OTVjNmY4ZGE2NWZjNzgzZGQ1ZTE3YTlmZTYzYTUwMDBlNzVlZWQxZjJkMmU4MjI5ZmRkN2Y5ZTQ5ZTVlOTc0NzE5MmQiLCJpYXQiOjE2NzQ3NzMxNjYuMzk1OTU3LCJuYmYiOjE2NzQ3NzMxNjYuMzk1OTYsImV4cCI6NDgzMDQ0Njc2Ni4zOTE3NTcsInN1YiI6IjU1MzI5Iiwic2NvcGVzIjpbImVtYWlsX2Z1bGwiLCJkb21haW5zX2Z1bGwiLCJhY3Rpdml0eV9mdWxsIiwiYW5hbHl0aWNzX2Z1bGwiLCJ0b2tlbnNfZnVsbCIsIndlYmhvb2tzX2Z1bGwiLCJ0ZW1wbGF0ZXNfZnVsbCIsInN1cHByZXNzaW9uc19mdWxsIiwic21zX2Z1bGwiLCJlbWFpbF92ZXJpZmljYXRpb25fZnVsbCIsImluYm91bmRzX2Z1bGwiLCJyZWNpcGllbnRzX2Z1bGwiLCJzZW5kZXJfaWRlbnRpdHlfZnVsbCJdfQ.aZ22A1C7bR8KHfC3vowl_Ev0zIeLa-bEXJDWtwCmoy0ze5Uz-B8PMYD_1inAxT7dEiGrDrlEuXdR44GRdynQs8ESCCnRNDKn8W2x34muqDSHOeRQ4L8OniwQ-TQI4VuJdPQr7WuRsfJtXXkJTofGYRtwTrBIjPqjPr--AA5mlVJNqYIJYOPN3r6C8NjKH6sHnKDzh7ROO6cc545UneWCowAXYn8oerJG-GfTa23lUXOUb2WvU4yUXYVOhlI6f1ub0XqEdkt0LiAO44YO1Fm2z9Fh1jhO7lYo0c06DDxpjCNK7BCD6zDp96ZVlp1BoYiHxZZSQGTJMWAYy40D78j5cjRxKU7FKgGIfJdDaZpWXSpSvMaa02q_L0Y3uxwc7hYGB1cp3L5DK70aOVPsx6B7yyduHjej7ozfolSbI3mUAPQPwIkaZ538zHeVJpQZnLPaFueFVn33z404XVIlJ5VP4Kn7Lysmkc_N8DlbDdFM3j0z528FNh5kdqUcrngbUxk4mg9FfcSXkmVR4H97Ia0HyivLvhR18q6QcqinVfnE66d9HGC9qsOKra018SAI-uchlGBDYo_7_RhW_-MChoXXjQuxqGQ7YeZnOhKi9Gy-q9AAibtKeKbFH6F9gLh1bx-q5coyFFJl8nY0CDs9N6ERB9KgwQCwhw65LhQP26G1uDs",
});

const sendPaymentReceive = async (email, subject, orderID) => {
	try {
		const recipients = [new Recipient(email, "Your Client")];
		
		const variables = [
			{
				email: await email,
				substitutions: [
					{
						var: 'order_number',
						value: await orderID
					}
				],
			}
		];
		
		const emailParams = await new EmailParams()
			.setFrom("support@m2bshop.com")
			.setFromName("Matthijs Bos from M2BShop")
			.setRecipients(recipients)
			.setSubject(subject)
			.setTemplateId('351ndgwrodq4zqx8')
			.setVariables(variables);
		
		await mailersend.send(emailParams);
	} catch (error) {
		console.log(error);
	}	
}

const sendOrderShipped = async (email, subject, date, address, delivery_date) => {
	const recipients = [new Recipient(email, "Your Client")];

	const variables = [
		{
			email: await email,
			substitutions: [
				{
					var: 'date',
					value: await date
				},
				{
					var: 'address',
					value: await address
				},
				{
					var: 'order_number',
					value: await orderID
				},
				{
					var: 'delivery_date',
					value: await delivery_date
				}
			],
		}
	];

	const emailParams = await new EmailParams()
			.setFrom("support@m2bshop.com")
			.setFromName("Matthijs Bos from M2BShop")
			.setRecipients(recipients)
			.setSubject(subject)
			.setTemplateId('z3m5jgr91j0gdpyo')
			.setVariables(variables);

	await mailersend.send(emailParams);
}

const sendOrderDelivered = async (email, subject, orderID, delivery_date) => {
	const recipients = [new Recipient(email, "Your Client")];

	const variables = [
		{
			email: await email,
			substitutions: [
				{
					var: 'order_number',
					value: await orderID
				},
				{
					var: 'delivery_date',
					value: await delivery_date
				}
			],
		}
	];

	const emailParams = await new EmailParams()
			.setFrom("support@m2bshop.com")
			.setFromName("Matthijs Bos from M2bShop")
			.setRecipients(recipients)
			.setSubject(subject)
			.setTemplateId('pq3enl6xqprl2vwr')
			.setVariables(variables);

	await mailersend.send(emailParams);
}

module.exports = {
	sendPaymentReceive,
	sendOrderShipped,
	sendOrderDelivered,
}