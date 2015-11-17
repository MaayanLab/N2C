<?php
ob_start('ob_gzhandler');
$number = $_GET["number"];
if (is_numeric($number)){
	$locationJSON = $_SERVER['DOCUMENT_ROOT']."/N2C/JSON/";
	switch ($number) { 
		case 0:
			//KK Direct
			$JSON= file_get_contents($locationJSON . "KK_Direct.json");
			break;
		case 1:
			//KK Substrate
			$JSON= file_get_contents($locationJSON . "KEA.json");
			break;
		case 2:
			//TF TF Direct
			$JSON= file_get_contents($locationJSON . "TFTF_Direct.json");
			break;
		case 3:
			//ChEA by Trial
			$JSON= file_get_contents($locationJSON . "ChEA.json");
			break;
		case 4:
			//Biocarta
			$JSON= file_get_contents($locationJSON . "Biocarta.json");
			break;
		case 5:
			//GeneOntology - Biological Processes
			$JSON= file_get_contents($locationJSON . "GO_BP.json");
			break;
		case 6:
			//GeneOntology - Cellular Components
			$JSON= file_get_contents($locationJSON . "GO_CC.json");
			break;
		case 7:
			//GeneOntology - Molecular Function
			$JSON= file_get_contents($locationJSON . "GO_MF.json");
			break;
		case 8:
			//KEGG Pathways
			$JSON= file_get_contents($locationJSON . "KEGG_Pathway.json");
			break;
		case 9:
			//MGI - Molecular Processes - top 4
			$JSON= file_get_contents($locationJSON . "MGI_MP_top4.json");
			break;
		case 10:
			//MicroRNA
			$JSON= file_get_contents($locationJSON . "MicroRNA.json");
			break;
			
		case 11:
			//OMIM
			$JSON= file_get_contents($locationJSON . "OMIM.json");
			break;
			
		case 12:
			//PFAM
			$JSON= file_get_contents($locationJSON . "PFAM.json");
			break;
		
			
		case 13:
			//Reactome
			$JSON= file_get_contents($locationJSON . "Reactome.json");
			break;
			
		case 14:
			//Wikipathways
			$JSON= file_get_contents($locationJSON . "Wikipathways.json");
			break;
		
		
		
		
		case 16:
			//Encode TFs
			$JSON= file_get_contents($locationJSON . "encode_tf_chip-seq_flip_filt.txt_pvalue.json");
			break;
		case 17:
			//GenomeBrowser
			$JSON= file_get_contents($locationJSON . "GENOMEBROWSER+TRANSFAC.json");
			break;
		case 18:
			//Hub Proteins
			$JSON= file_get_contents($locationJSON . "HUB PROTEINS.json");
			break;
		case 19:
			//HumanChEA
			$JSON= file_get_contents($locationJSON . "HUMAN ChEA.json");
			break;
		case 20:
			//MGI - Top 3
			$JSON= file_get_contents($locationJSON . "MGI-Top3.json");
			break;
		case 21:
			//Mouse ChEA
			$JSON= file_get_contents($locationJSON . "Mouse ChEA.json");
			break;
		case 22:
			//OMIM EXPANDED
			$JSON= file_get_contents($locationJSON . "OMIM_EXPANDED.json");
			break;
			
		case 23:
			//PPI HUB PROTEINS
			$JSON= file_get_contents($locationJSON . "PPI HUB PROTEINS.json");
			break;
			
		case 24:
			//TRANSFAC
			$JSON= file_get_contents($locationJSON . "TRANSFAC.json");
			break;
		
			
		case 25:
			//VirusMINT
			$JSON= file_get_contents($locationJSON . "VirusMINT.json");
			break;
			
		case 26:
			//Human Gene Atlas
			$JSON= file_get_contents($locationJSON . "Human Gene Atlas.json");
			break;
		
		case 27:
			//Human Endogenous Complex
			$JSON= file_get_contents($locationJSON . "Human Endogenous Complex.json");
			break;
			
		case 28:
			//Mouse Gene Atlas
			$JSON= file_get_contents($locationJSON . "Mouse Gene Atlas.json");
			break;
			
		case 29:
			//Cancer Cell Line
			$JSON= file_get_contents($locationJSON . "Cancer Cell Line.json");
			break;
		case 30:
			//NCI60
			$JSON= file_get_contents($locationJSON . "NCI60.json");
			break;
		case 31:
			//GeneSIG DB
			$JSON= file_get_contents($locationJSON . "genesigdb.json");
			break;
			
		case 32:
			// UP CMAP Top 100
			$JSON= file_get_contents($locationJSON . "up-regulated_cmap_100_flip_filt.txt_pvalue.json");
			break;
		case 33:
			// DOWN CMAP Top 100
			$JSON= file_get_contents($locationJSON . "down-regulated_cmap_100_flip_filt.txt_pvalue.json");
			break;
		case 34:
			// CORUM
			$JSON= file_get_contents($locationJSON . "corum_flip_filt.txt_pvalue.json");
			break;
		case 35:
			// HMDB
			$JSON= file_get_contents($locationJSON . "HMDB.json");
			break;
		case 36:
			// Histone
			//$JSON= file_get_contents($locationJSON . "Histone.json");
			$JSON= file_get_contents($locationJSON . "histone_roadmap_uniq_flip_filt.txt_pvalue.json");
			
			break;
		
		case 37:
			// New Histone
			$JSON= file_get_contents($locationJSON . "histone_roadmap_uniq_flip_filt.txt_pvalue.json");
			break;
		
		case 38:
			$JSON= file_get_contents($locationJSON . "tfbs_encode_2_uniq2_flip_filt.txt_pvalue.json");
			break;
		
		case 39:
			// ChEA 2
			$JSON = file_get_contents($locationJSON . "ChEA2.json");
			break;
		}
		
	}
	//header('Content-type: application/json');
	$response = $JSON;
	echo $response;
	
?>