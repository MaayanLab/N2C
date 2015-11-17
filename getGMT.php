<?php
ob_start('ob_gzhandler');
$number = $_GET["number"];

if (is_numeric($number)){
	$locationGMT = $_SERVER['DOCUMENT_ROOT']."/N2C/GMT/";
	switch ($number) { 
		case 0:
			//KK Direct
			$GMT= file_get_contents($locationGMT . "KEA_GMT.json");
			break;
		case 1:
			//KK Substrate
			$GMT= file_get_contents($locationGMT . "KEA_GMT.json");
			break;
			
		case 2:
			//TF TF Direct
			$GMT= file_get_contents($locationGMT . "allCHEA_dict.json");
			break;
		case 3:
			//ChEA by Trial
			$GMT= file_get_contents($locationGMT . "ChEA_dict.json");
			break;
		case 4:
			//Biocarta
			$GMT= file_get_contents($locationGMT . "biocarta_pathways_dict.json");
			break;
		case 5:
			//GeneOntology - Biological Processes
			$GMT= file_get_contents($locationGMT . "geneontology_bp_dict.json");
			break;
		case 6:
			//GeneOntology - Cellular Components
			$GMT= file_get_contents($locationGMT . "geneontology_cc_dict.json");
			break;
		case 7:
			//GeneOntology - Molecular Function
			$GMT= file_get_contents($locationGMT . "geneontology_mf_dict.json");
			break;
		case 8:
			//KEGG Pathways
			$GMT= file_get_contents($locationGMT . "kegg_pathways_dict.json");
			break;
		case 9:
			//MGI - Molecular Processes - top 4
			$GMT= file_get_contents($locationGMT . "mgi_mp_top4_dict.json");
			break;
		case 10:
			//MicroRNA
			$GMT= file_get_contents($locationGMT . "microrna_dict.json");
			break;
			
		case 11:
			//OMIM
			$GMT= file_get_contents($locationGMT . "omim_disease_genes_dict.json");
			break;
		case 12:
			//PFAM
			$GMT= file_get_contents($locationGMT . "pfam-interpro-domains_dict.json");
			break;
			
		case 13:
			//Reactome
			$GMT= file_get_contents($locationGMT . "reactome_pathways_dict.json");
			break;
			
		case 14:
			//Wikipathways
			$GMT= file_get_contents($locationGMT . "wikipathways_pathways_dict.json");
			break;
		
		
		
		case 16:
			//Encode TFs
			$GMT= file_get_contents($locationGMT . "ENCODE_GMT.json");
			break;
		case 17:
			//GenomeBrowser
			$GMT= file_get_contents($locationGMT . "GenomeBrowser_old_TRANSFAC_dict.json");
			break;
		case 18:
			//Hub Proteins
			$GMT= file_get_contents($locationGMT . "Hub_Proteins_dict.json");
			break;
		case 19:
			//HumanChEA
			$GMT= file_get_contents($locationGMT . "Human_ChEA_dict.json");
			break;
		case 20:
			//MGI - Top 3
			$GMT= file_get_contents($locationGMT . "MGI_MP_top3_dict.json");
			break;
		case 21:
			//Mouse ChEA
			$GMT= file_get_contents($locationGMT . "Mouse_ChEA_dict.json");
			break;
		case 22:
			//OMIM EXPANDED
			$GMT= file_get_contents($locationGMT . "OMIM_Expanded_dict.json");
			break;
			
		case 23:
			//PPI HUB PROTEINS
			$GMT= file_get_contents($locationGMT . "PPI_Hub_Proteins_dict.json");
			break;
			
		case 24:
			//TRANSFAC
			$GMT= file_get_contents($locationGMT . "Transfac_GMT_dict.json");
			break;
		
			
		case 25:
			//VirusMINT
			$GMT= file_get_contents($locationGMT . "VirusMINT_dict.json");
			break;
		
		case 26:
			//Human Gene Atlas
			$GMT= file_get_contents($locationGMT . "HUMAN_GENE_ATLAS_dict.json");
			break;
					

		case 27:
			//Human Endogenous Complexome
			$GMT= file_get_contents($locationGMT . "Human Endogenous Complexome_dict.json");
			break;
			
		case 28:
			//Mouse Gene Atlas
			$GMT= file_get_contents($locationGMT . "Mouse_Gene_Atlas_dict.json");
			break;
			
		case 29:
			//Cancer Cell Line
			$GMT= file_get_contents($locationGMT . "Cancer_Cell_Line_Encyclopedia_dict.json");
			break;
		case 30:
			//NCI60
			$GMT= file_get_contents($locationGMT . "NCI60_dict.json");
			break;
		case 31:
			//GeneSig DB
			$GMT= file_get_contents($locationGMT . "genesigdb_dict.json");
			break;
		case 32:
			//UP CMAP Top 100
			$GMT= file_get_contents($locationGMT . "UP_CMAP.json");
			break;
		case 33:
			//DOWN CMAP Top 100
			$GMT= file_get_contents($locationGMT . "DOWN_CMAP.json");
			break;
		case 34:
			//CORUM
			
			$GMT= file_get_contents($locationGMT . "CORUM_dict.json");
			break;
		case 35:
			//HMDB
			$GMT= file_get_contents($locationGMT . "hmdb_metabolites_dict.json");
			break;
			
		case 36:
			//HISTONE
			//$GMT= file_get_contents($locationGMT . "HISTONE_epigenetics_roadmap_dict.json");
			$GMT= file_get_contents($locationGMT . "histone_roadmap_uniq_dict.json");
			break;
		case 37:
			//HISTONE
			$GMT= file_get_contents($locationGMT . "histone_roadmap_uniq_dict.json");
			break;
		case 38:
			//HISTONE
			$GMT= file_get_contents($locationGMT . "tfbs_encode_2_uniq2_dict.json");
			break;
			
		case 39:
			// ChEA 2
			$GMT = file_get_contents($locationGMT . "ChEA2_dict.json");
			break;
		}
	}
	header('Content-type: application/json');
	echo $GMT;
	
?>