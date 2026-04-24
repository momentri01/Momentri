import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import prisma from '../utils/prisma.js';
// Removed unused import: import { CampaignStatus } from '../types/prisma.js'; 

// Placeholder for TaxReceipt generation logic
const generateTaxReceipt = async (donation: any, campaign: any, organization: any) => {
    console.log(`Generating tax receipt for donation ${donation.id} for campaign ${campaign.id} by organization ${organization.id}`);
    try {
        const receiptNumber = `TX-${campaign.id.substring(0, 6).toUpperCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        await prisma.taxReceipt.create({
            data: {
                donationId: donation.id,
                campaignId: campaign.id,
                organizationId: organization.id,
                organizationTaxId: organization.registrationNumber, // Assuming organization has registrationNumber
                donorName: donation.donorName,
                donorEmail: donation.donorEmail,
                amount: donation.netAmount, // Corrected from 'amount' to 'netAmount'
                currency: donation.currency,
                receiptNumber: receiptNumber,
                issuedBy: organization.businessName || organization.fullName // Use businessName if available, else fullName
            }
        });
        console.log(`Tax receipt ${receiptNumber} created.`);
        // In a real scenario, send email here
        return receiptNumber;
    } catch (dbError) {
        console.error("Failed to create TaxReceipt in DB:", dbError);
        return null;
    }
};

export const createCampaign = async (req: AuthRequest, res: Response) => {
  const { title, description, campaignGoal, currency, startDate, endDate, coverImageUrl } = req.body;
  const organizationId = req.user?.userId;

  if (!organizationId) {
    return res.status(400).json({ message: 'Organization ID not found in user.' });
  }

  try {
    const campaign = await prisma.campaign.create({
      data: {
        organizationId,
        title,
        description,
        campaignGoal,
        currency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        coverImageUrl,
        status: 'ACTIVE', // Default status
      },
    });
    res.status(201).json(campaign);
  } catch (error: any) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: 'Error creating campaign', error: error.message });
  }
};

export const getOrganizationCampaigns = async (req: AuthRequest, res: Response) => {
  const organizationId = req.user?.userId;

  if (!organizationId) {
    return res.status(400).json({ message: 'Organization ID not found.' });
  }

  try {
    const campaigns = await prisma.campaign.findMany({
      where: { organizationId },
      include: {
        donations: { // Ensure donations are included
            select: { // Only fetch necessary donation details for summary
                grossAmount: true,
                netAmount: true,
                currency: true,
                paymentStatus: true
            }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    const campaignsWithAggregates = campaigns.map(campaign => {
        let totalDonationsGross = 0;
        let totalDonationsNet = 0;
        let successfulDonationsCount = 0;

        // Ensure campaign.donations is an array before iterating
        if (campaign.donations && Array.isArray(campaign.donations)) {
            campaign.donations.forEach(donation => {
                if (donation.paymentStatus === 'SUCCESSFUL') {
                    totalDonationsGross += donation.grossAmount;
                    totalDonationsNet += donation.netAmount;
                    successfulDonationsCount++;
                }
            });
        }

        return {
            ...campaign,
            totalDonationsGross,
            totalDonationsNet,
            successfulDonationsCount
        };
    });

    res.json(campaignsWithAggregates);
  } catch (error: any) {
    console.error('Error fetching organization campaigns:', error);
    res.status(500).json({ message: 'Error fetching campaigns', error: error.message });
  }
};

export const getCampaignById = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const organizationId = req.user?.userId; // Ensure it's an organization managing this campaign

  if (!organizationId) {
    return res.status(400).json({ message: 'Organization ID not found.' });
  }

  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        organization: { // Ensure organization is included correctly
            select: { id: true, businessName: true, fullName: true, registrationNumber: true }
        },
        donations: { // Ensure donations are included correctly
            where: { paymentStatus: 'SUCCESSFUL' }, 
            select: {
                id: true,
                donorName: true,
                donorEmail: true,
                grossAmount: true,
                netAmount: true, // Corrected from 'amount' to 'netAmount' as per schema
                currency: true,
                paymentStatus: true,
                message: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    if (campaign.organizationId !== organizationId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this campaign' });
    }

    let totalDonationsGross = 0;
    let totalDonationsNet = 0;
    let successfulDonationsCount = 0;

    // Ensure campaign.donations is an array before iterating
    if (campaign.donations && Array.isArray(campaign.donations)) {
        campaign.donations.forEach(donation => {
            totalDonationsGross += donation.grossAmount;
            totalDonationsNet += donation.netAmount; // Using netAmount for calculation
            successfulDonationsCount++;
        });
    }
    
    const campaignDetails = {
        ...campaign,
        totalDonationsGross,
        totalDonationsNet,
        successfulDonationsCount,
        organization: campaign.organization, 
        donations: campaign.donations 
    };

    res.json(campaignDetails);
  } catch (error: any) {
    console.error('Error fetching campaign by ID:', error);
    res.status(500).json({ message: 'Error fetching campaign', error: error.message });
  }
};

export const updateCampaign = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const organizationId = req.user?.userId;
  const { title, description, campaignGoal, currency, startDate, endDate, status, coverImageUrl } = req.body;

  if (!organizationId) {
    return res.status(400).json({ message: 'Organization ID not found.' });
  }

  try {
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id },
      select: { organizationId: true }
    });

    if (!existingCampaign || existingCampaign.organizationId !== organizationId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this campaign or campaign not found.' });
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        title,
        description,
        campaignGoal,
        currency,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status,
        coverImageUrl,
      },
    });
    res.json(updatedCampaign);
  } catch (error: any) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ message: 'Error updating campaign', error: error.message });
  }
};

export const deleteCampaign = async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const organizationId = req.user?.userId;

  if (!organizationId) {
    return res.status(400).json({ message: 'Organization ID not found.' });
  }

  try {
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id },
      select: { organizationId: true }
    });

    if (!existingCampaign || existingCampaign.organizationId !== organizationId) {
      return res.status(403).json({ message: 'Forbidden: You do not own this campaign or campaign not found.' });
    }

    const deletedCampaign = await prisma.campaign.update({
      where: { id },
      data: { status: 'ARCHIVED' }, 
    });
    res.json({ message: 'Campaign archived successfully', campaign: deletedCampaign });
  } catch (error: any) {
    console.error('Error archiving campaign:', error);
    res.status(500).json({ message: 'Error archiving campaign', error: error.message });
  }
};

// Endpoint for sending thank you notes
export const sendThankYouNotes = async (req: AuthRequest, res: Response) => {
    const campaignId = req.params.campaignId as string;
    const organizationId = req.user?.userId;

    if (!organizationId) {
        return res.status(400).json({ message: 'Organization ID not found.' });
    }

    try {
        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId },
            include: {
                organization: { select: { id: true, businessName: true, fullName: true } },
                donations: {
                    where: { paymentStatus: 'SUCCESSFUL' },
                    select: { id: true, donorName: true, donorEmail: true, netAmount: true, grossAmount: true, currency: true, createdAt: true }
                }
            }
        });

        if (!campaign || campaign.organizationId !== organizationId) {
            return res.status(403).json({ message: 'Forbidden: You do not own this campaign or campaign not found.' });
        }

        if (!campaign.donations || campaign.donations.length === 0) { // Check if donations array exists and is not empty
            return res.status(400).json({ message: 'No successful donations found for this campaign to send thank you notes.' });
        }

        const sentEmails = [];
        for (const donation of campaign.donations) {
            console.log(`Simulating sending thank you to ${donation.donorEmail} for donation ${donation.id} to campaign ${campaign.title}`);
            sentEmails.push(donation.donorEmail);
        }

        res.json({ message: `Thank you notes simulated for ${sentEmails.length} donors.`, sentTo: sentEmails });

    } catch (error: any) {
        console.error('Error sending thank you notes:', error);
        res.status(500).json({ message: 'Error sending thank you notes', error: error.message });
    }
};

// Endpoint for issuing tax receipts
export const issueTaxReceipts = async (req: AuthRequest, res: Response) => {
    const campaignId = req.params.campaignId as string;
    const organizationId = req.user?.userId;

    if (!organizationId) {
        return res.status(400).json({ message: 'Organization ID not found.' });
    }

    try {
        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId },
            include: {
                organization: { select: { id: true, businessName: true, fullName: true, registrationNumber: true, country: true, province: true } },
                donations: {
                    where: { paymentStatus: 'SUCCESSFUL' },
                    select: {
                        id: true,
                        donorName: true,
                        donorEmail: true,
                        netAmount: true,
                        grossAmount: true,
                        currency: true,
                        createdAt: true
                    }
                }
            }
        });

        if (!campaign || campaign.organizationId !== organizationId) {
            return res.status(403).json({ message: 'Forbidden: You do not own this campaign or campaign not found.' });
        }

        if (!campaign.donations || campaign.donations.length === 0) { // Check if donations array exists and is not empty
            return res.status(400).json({ message: 'No successful donations found for this campaign to issue tax receipts.' });
        }

        const issuedReceipts = [];
        for (const donation of campaign.donations) {
            const existingReceipt = await prisma.taxReceipt.findFirst({
                where: { donationId: donation.id }
            });

            if (existingReceipt) {
                console.log(`Tax receipt already exists for donation ${donation.id}`);
                continue; 
            }

            const receiptNumber = `TX-${campaign.id.substring(0, 6).toUpperCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            
            const taxReceipt = await prisma.taxReceipt.create({
                data: {
                    donationId: donation.id,
                    campaignId: campaign.id,
                    organizationId: campaign.organizationId,
                    organizationTaxId: campaign.organization.registrationNumber,
                    donorName: donation.donorName,
                    donorEmail: donation.donorEmail,
                    amount: donation.netAmount, // Corrected from 'amount' to 'netAmount'
                    currency: donation.currency,
                    receiptNumber: receiptNumber,
                    issuedBy: campaign.organization.businessName || campaign.organization.fullName,
                    dateIssued: new Date()
                }
            });
            issuedReceipts.push(taxReceipt);
            console.log(`Issued tax receipt ${receiptNumber} for donation ${donation.id}`);
            // In a real app, trigger email sending here
        }

        res.json({ message: `Issued ${issuedReceipts.length} tax receipts.`, receipts: issuedReceipts });

    } catch (error: any) {
        console.error('Error issuing tax receipts:', error);
        res.status(500).json({ message: 'Error issuing tax receipts', error: error.message });
    }
};