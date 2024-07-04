const path = require('path');
const express = require('express');
const pool= require('../db/db');
const { checkAuth } = require("../middleware/auth.middleware");
const multer  = require('multer');
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './public/avatars');
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname);
	}
});

const privateRouter = express.Router();
privateRouter.use(checkAuth);
privateRouter.use('/public',express.static(path.join(__dirname, "../public")));
privateRouter.use(express.json());


const upload = multer({ storage: storage });
privateRouter.use(express.json());

privateRouter.get('/auth', checkAuth, async(req,res) =>{
    res.status(200).send('ok');
})

privateRouter.get('/admin', async(req,res) =>{
    const userEmail = req.session.userEmail;
    const AdmRes = await pool.query("SELECT Admin FROM Users WHERE Email = $1", [userEmail])
    if (AdmRes.rows.length > 0) {
        const isAdmin = AdmRes.rows[0].admin;
        res.status(200).json({ isAdmin: isAdmin });
    } else {
        res.status(404).json({ message: "User not found" });
    }
})

privateRouter.get('/profile', async(req,res)=>{
    const userEmail = req.session.userEmail;
    const userid = req.session.userId;
    const results = await pool.query("SELECT * FROM Users WHERE Email = $1", [userEmail]);
    if (results.rows.length > 0) {
        res.status(200).json({ profInfo: results.rows[0] }); 
    } else {
        res.status(404).json({ error: "User not found" });
    }
    } 
)


privateRouter.get('/teams', async(req,res)=>{
    const userEmail = req.session.userEmail;
   const results = await pool.query("SELECT * FROM Teams ORDER BY id DESC")
    if(results.rows.length>0){
        res.status(200).json({ teams: results.rows });
    }
    else {
        res.status(404).json({ message: 'No teams found' });
    }
})


privateRouter.get('/tournaments', async(req,res)=>{
    const userEmail = req.session.userEmail;
    const results = await pool.query("SELECT * FROM AllTournaments ORDER BY Date DESC");
 
        if (results.rows.length > 0) {
            const tournaments = results.rows;
            for (let tournament of tournaments) {
                let resultsQuery;
                switch (tournament.type){
                    case '1x1all':
                        resultsQuery = `SELECT * FROM Results_1x1all WHERE TournamentID = $1`;
                        break;
                    case '1x1':
                        resultsQuery = `SELECT * FROM Results_1x1 WHERE TournamentID = $1`;
                        break;
                    case 'b_r':
                        resultsQuery = `SELECT * FROM Results_b_r WHERE TournamentID = $1`;
                        break;
                    default:
                        resultsQuery = null;
                }
                if (resultsQuery) {
                    const resultsData = await pool.query(resultsQuery, [tournament.id]);
                    tournament.results = resultsData.rows;
                } else {
                    tournament.results = [];
                }
            }
            res.status(200).json({ tournaments: tournaments});

            
            console.log('OK');
        } else {
            res.status(404).json({ message: 'No tournaments found' });
        }
        
})

privateRouter.get('/tournamentsforTeam', async(req,res)=>{
    const userEmail = req.session.userEmail;
    const results = await pool.query("SELECT * FROM AllTournamentsT ORDER BY CreateTime DESC")
    if(results.rows.length>0){
        const tournaments = results.rows;
            for (let tournament of tournaments) {
                let resultsQuery;
                switch (tournament.type){
                    case 'team':
                        resultsQuery = `SELECT * FROM Results_team WHERE TournamentID = $1`;
                        break;
                    
                    case 'b_r_t':
                        resultsQuery = `SELECT * FROM Results_b_r_t WHERE TournamentID = $1`;
                        break;
                    default:
                        resultsQuery = null;
                }
                if (resultsQuery) {
                    const resultsData = await pool.query(resultsQuery, [tournament.id]);
                    tournament.results = resultsData.rows;
                } else {
                    tournament.results = [];
                }
            }
            res.status(200).json({ tournaments: tournaments});

            
            console.log('OK');
    }
    else {
        res.status(404).json({ message: 'No tournaments found' });
    }
})

privateRouter.get('/my_team', async(req,res)=>{
    const userEmail = req.session.userEmail;
    const results = await pool.query("SELECT t.id, t.TeamName, t.NumOfPeople, t.RetailerEmail FROM Teams t INNER JOIN TeamMembers tm ON t.id = tm.TeamID WHERE tm.MemberEmail = $1", [userEmail]);
        
    if (results.rows.length > 0) {
        const teamName = results.rows[0].TeamName;
        const isRet = await pool.query("SELECT 1 FROM Teams WHERE TeamName = $1 AND RetailerEmail = $2", [teamName, userEmail]);
        res.status(200).json({ teams: results.rows, userEmail: userEmail, isRet: isRet.rows.length > 0 });
    } else {
        res.status(200).json({ teams: [], userEmail: userEmail, isRet: false });
    }
})



privateRouter.get('/my_tournaments', async(req,res)=>{
    const userEmail = req.session.userEmail;
    const results = await pool.query("SELECT AT.id, AT.TournamentName, AT.Type, AT.Game, AT.Format, AT.NumOfParticipants, AT.Date, AT.TimeFrom, AT.TimeTo, AT.CreateTime FROM AllTournaments AT INNER JOIN AllParticipants AP ON AT.id = AP.TournamentID WHERE AP.ParticipantEmail = $1",[userEmail])
  
    if (results.rows.length > 0) {
        res.status(200).json({ my_tournaments: results.rows, userEmail: userEmail });
    } else {
        res.status(200).json({ my_tournaments: [], userEmail: userEmail });
    }
})

privateRouter.get('/my_Teamtournaments', async(req,res)=>{
    const userEmail = req.session.userEmail;

    const resTeam = await pool.query('SELECT TeamID FROM TeamMembers WHERE MemberEmail=$1', [userEmail]);

    const team_id = resTeam.rows[0].teamid;

    
    const teamNameRes = await pool.query('SELECT TeamName FROM Teams WHERE id=$1', [team_id]);
    if (teamNameRes.rows.length === 0) {
        return res.status(404).send('Team not found');
    }

    const team_name = teamNameRes.rows[0].teamname;

  
    const results = await pool.query(
        "SELECT AT.id, AT.TournamentName, AT.Type, AT.Game, AT.NumOfCommands, AT.Date, AT.TimeFrom, AT.TimeTo, AT.CreateTime FROM AllTournamentsT AT INNER JOIN AllParticipantsT AP ON AT.id = AP.TournamentID WHERE AP.TeamName = $1",
        [team_name]
    );

    res.status(200).json({ my_Teamtournaments: results.rows });
}) 


privateRouter.get('/my_tournaments/part', async(req,res)=>{
    const tournament_id = req.query.id;
    const tournament_type = req.query.type;
    const userEmail = req.session.userEmail;
    const nameRes = await pool.query(`SELECT * FROM Tournaments_${tournament_type} WHERE id=$1 AND Type=$2`, [tournament_id, tournament_type]);

        if (nameRes.rowCount === 0) {
            return res.status(404).send('Турнир не найден');
        }

        const tournament_name = nameRes.rows[0].tournamentname;
        console.log(`Название турнира: ${tournament_name}`);

        const retRes = await pool.query(`SELECT * FROM Retailers_${tournament_type} WHERE TournamentID=$1`, [tournament_id]);

        let isRetailer = false;
        if (retRes.rowCount > 0) {
            const creatorEmail = retRes.rows[0].retaileremail;
            isRetailer = userEmail === creatorEmail;
           
        } else {
            console.log(`Пользователь ${userEmail} не найден в таблице ретейлеров`);
        }

        const results = await pool.query(`SELECT * FROM Participants_${tournament_type} WHERE TournamentID=$1`, [tournament_id]);
        const tournamentResults = await pool.query(`SELECT * FROM Results_${tournament_type} WHERE TournamentID=$1`, [tournament_id]);
        const hasResults = tournamentResults.rowCount > 0;
      

        res.status(200).json({
            tourn: results.rows,
            userEmail: userEmail,
            tournament_name: tournament_name,
            isRetailer: isRetailer,
            isResult: hasResults
        });
}) 

privateRouter.get('/my_team/part', async(req,res)=>{
    const team_id = req.query.id;
    const userEmail = req.session.userEmail;
    const results = await pool.query("SELECT * FROM TeamMembers WHERE TeamID = $1", [team_id]);

       
    const nameRes = await pool.query('SELECT * FROM Teams WHERE id = $1', [team_id]);

      
    if (nameRes.rows.length === 0) {
        return res.status(404).json({ error: 'Команда не найдена' });
    }

        
    const creatorEmail = nameRes.rows[0].retaileremail;
    const isRetailer = userEmail === creatorEmail;

    const team_name = nameRes.rows[0].teamname;

    if (results.rows.length > 0) {
            res.status(200).json({
                teams: results.rows,
                userEmail: userEmail,
                team_name: team_name,
                isRetailer: isRetailer
            });
    } else {
            res.status(404).json({ error: 'Участники команды не найдены' });
        }
})

privateRouter.get('/myTeamTournaments/part', async(req,res)=>{
    const tournament_id = req.query.id;
    const tournament_type = req.query.type;
    const userEmail = req.session.userEmail;
   const results =await pool.query(`SELECT * FROM Teams_${tournament_type} WHERE TournamentID = $1`,[tournament_id])

   const tournament_name = results.rows[0].TournamentName;
   
   const retRes = await pool.query(`SELECT * FROM Retailers_${tournament_type} WHERE TournamentID=$1`, [tournament_id, userEmail])
   if (retRes.rowCount === 0) {
    return res.status(404).json({ error: "Retailer not found" });
}
   const creatorEmail = retRes.rows[0].retaileremail;

   const tournamentResults = await pool.query(`SELECT * FROM Results_${tournament_type} WHERE TournamentID = $1`, [tournament_id]);
   const isRetailer = userEmail === creatorEmail;
   const hasResults = tournamentResults.rowCount > 0;
    if(results.rows.length>0){
        res.status(200).json({team_tourn: results.rows, userEmail: userEmail, type:tournament_type, tourn_id:tournament_id, isRetailer:isRetailer,tournament_name:tournament_name,
        isResult: hasResults});
    }
})


privateRouter.get('/team_info', async(req,res)=>{
    const team_id = req.query.id;
    const userEmail = req.session.userEmail;
    const results = await pool.query("SELECT * FROM TeamMembers WHERE TeamID = $1",[team_id])

    const nameRes = await pool.query('SELECT * FROM Teams WHERE id = $1',[team_id])

    const team_name =nameRes.rows[0].TeamName;
    if(results.rows.length>0){
        res.status(200).json({teams: results.rows, userEmail: userEmail, team_name:team_name});
    }
})

privateRouter.get('/fill/results', async(req,res)=>{
    const tourn_id =req.query.id;
   
    const type = req.query.type;
    const userEmail = req.session.userEmail;
    let tablePref;

   switch (type) {
    case '1x1':
        tablePref = '1x1';
        break;

    case 'b_r':
        tablePref = 'b_r';
        break;
    default:
        return res.status(400).send('Неверный тип турнира!');
}   
    const isRet = await pool.query(`SELECT 1 FROM Retailers_${tablePref} WHERE TournamentID = $1 AND RetailerEmail = $2`, [tourn_id, userEmail])
    const nameRes= await pool.query(`SELECT TournamentName FROM Tournaments_${tablePref} WHERE id = $1`, [tourn_id])
    const tourn_name = nameRes.rows[0].tournamentname;
    const participantsRes = await pool.query(`SELECT ParticipantEmail FROM Participants_${tablePref} WHERE TournamentID = $1`, [tourn_id]);
    const participants = participantsRes.rows.map(row => row.participantemail);
    res.status(200).json({participants: participants, userEmail:userEmail ,isRet: isRet.rowCount > 0, tourn_name: tourn_name})

})


privateRouter.get('/fill/results/team', async(req,res)=>{
    const tourn_id =req.query.id;
   
    const type = req.query.type;
    const userEmail = req.session.userEmail;
    let tablePref;

   switch (type) {
    case 'team':
        tablePref = 'team';
        break;

    case 'b_r_t':
        tablePref = 'b_r_t';
        break;
    default:
        return res.status(400).send('Неверный тип турнира!');
}   
    const isRet = await pool.query(`SELECT 1 FROM Retailers_${tablePref} WHERE TournamentID = $1 AND RetailerEmail = $2`, [tourn_id, userEmail])
    const nameRes= await pool.query(`SELECT TournamentName FROM Tournaments_${tablePref} WHERE id = $1`, [tourn_id])
    const tourn_name = nameRes.rows[0].TournamentName;
    const teamsRes = await pool.query(`SELECT TeamName FROM Teams_${tablePref} WHERE TournamentID = $1`, [tourn_id]);
    const teams = teamsRes.rows.map(row => row.participantemail);
    res.status(200).json({teams: teams, userEmail:userEmail , isRet: isRet, tourn_name: tourn_name})

})

privateRouter.get("/fill/results1x1/r1",async(req,res)=>{
    const tourn_id =req.query.id;
    const userEmail = req.session.userEmail;
    const isRet = await pool.query(`SELECT 1 FROM Retailers_1x1all WHERE TournamentID = $1 AND RetailerEmail = $2`, [tourn_id, userEmail])
    const participantRes = await pool.query('SELECT * FROM Participants_1x1all WHERE TournamentID = $1', [tourn_id]);
    const participants = participantRes.rows;
    res.status(200).json({participants: participants, userEmail:userEmail , isRet})

})
// возможно не понадобится)
// privateRouter.get("/fill/results1x1/r2",async(req,res)=>{
//     const tourn_id =req.query.id;
//     const userEmail = req.session.userEmail;
//     const isRet = await pool.query(`SELECT 1 FROM Retailers_1x1all WHERE TournamentID = $1 AND RetailerEmail = $2`, [tourn_id, userEmail])
//     const participantRes = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 1]);
//     const winners = participantRes.rows.map(row => row.winner);

//     let participants = [];
//     for (let i = 0; i < winners.length; i += 2) {
//         if (winners[i + 1] != undefined) {
//             participants.push([winners[i], winners[i + 1]]);
//         }
//     }

//     res.status(200).json({participants: participants, userEmail:userEmail , isRet})

// })
// privateRouter.get("/fill/results1x1/r3",async(req,res)=>{
//     const tourn_id =req.query.id;
//     const userEmail = req.session.userEmail;
//     const isRet = await pool.query(`SELECT 1 FROM Retailers_1x1all WHERE TournamentID = $1 AND RetailerEmail = $2`, [tourn_id, userEmail])
//     const participantRes = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 2]);
//     const winners = participantRes.rows.map(row => row.winner);

//     let participants = [];
//     for (let i = 0; i < winners.length; i += 2) {
//         if (winners[i + 1] != undefined) {
//             participants.push([winners[i], winners[i + 1]]);
//         }
//     }

//     res.status(200).json({participants: participants, userEmail:userEmail , isRet})

// })
// privateRouter.get("/fill/results1x1/r4",async(req,res)=>{
//     const tourn_id =req.query.id;
//     const userEmail = req.session.userEmail;
//     const isRet = await pool.query(`SELECT 1 FROM Retailers_1x1all WHERE TournamentID = $1 AND RetailerEmail = $2`, [tourn_id, userEmail])
//     const participantRes = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 3]);
//     const winners = participantRes.rows.map(row => row.winner);

//     let participants = [];
//     for (let i = 0; i < winners.length; i += 2) {
//         if (winners[i + 1] != undefined) {
//             participants.push([winners[i], winners[i + 1]]);
//         }
//     }

//     res.status(200).json({participants: participants, userEmail:userEmail , isRet})

// })
// privateRouter.get("/fill/results1x1/r5",async(req,res)=>{
//     const tourn_id =req.query.id;
//     const userEmail = req.session.userEmail;
//     const isRet = await pool.query(`SELECT 1 FROM Retailers_1x1all WHERE TournamentID = $1 AND RetailerEmail = $2`, [tourn_id, userEmail])
//     const participantRes = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 4]);
//     const winners = participantRes.rows.map(row => row.winner);

//     let participants = [];
//     for (let i = 0; i < winners.length; i += 2) {
//         if (winners[i + 1] != undefined) {
//             participants.push([winners[i], winners[i + 1]]);
//         }
//     }

//     res.status(200).json({participants: participants, userEmail:userEmail , isRet})

// })
// privateRouter.get("/fill/results1x1/r6",async(req,res)=>{
//     const tourn_id =req.query.id;
//     const userEmail = req.session.userEmail;
//     const isRet = await pool.query(`SELECT 1 FROM Retailers_1x1all WHERE TournamentID = $1 AND RetailerEmail = $2`, [tourn_id, userEmail])
//     const participantRes = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 5]);
//     const winners = participantRes.rows.map(row => row.winner);

//     let participants = [];
//     for (let i = 0; i < winners.length; i += 2) {
//         if (winners[i + 1] != undefined) {
//             participants.push([winners[i], winners[i + 1]]);
//         }
//     }

//     res.status(200).json({participants: participants, userEmail:userEmail , isRet})

// })
// privateRouter.get("/fill/results1x1/r7",async(req,res)=>{
//     const tourn_id =req.query.id;
//     const userEmail = req.session.userEmail;
//     const isRet = await pool.query(`SELECT 1 FROM Retailers_1x1all WHERE TournamentID = $1 AND RetailerEmail = $2`, [tourn_id, userEmail])
//     const participantRes = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 6]);
//     const winners = participantRes.rows.map(row => row.winner);

//     let participants = [];
//     for (let i = 0; i < winners.length; i += 2) {
//         if (winners[i + 1] != undefined) {
//             participants.push([winners[i], winners[i + 1]]);
//         }
//     }

//     res.status(200).json({participants: participants, userEmail:userEmail , isRet})

// })

// privateRouter.get("/fill/results1x1/r8",async(req,res)=>{
//     const tourn_id =req.query.id;
//     const userEmail = req.session.userEmail;
//     const isRet = await pool.query(`SELECT 1 FROM Retailers_1x1all WHERE TournamentID = $1 AND RetailerEmail = $2`, [tourn_id, userEmail])
//     const participantRes = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 7]);
//     const winners = participantRes.rows.map(row => row.winner);

//     let participants = [];
//     for (let i = 0; i < winners.length; i += 2) {
//         if (winners[i + 1] != undefined) {
//             participants.push([winners[i], winners[i + 1]]);
//         }
//     }

//     res.status(200).json({participants: participants, userEmail:userEmail , isRet})

// })

// privateRouter.get("/fill/results1x1/r9",async(req,res)=>{
//     const tourn_id =req.query.id;
//     const userEmail = req.session.userEmail;
//     const isRet = await pool.query(`SELECT 1 FROM Retailers_1x1all WHERE TournamentID = $1 AND RetailerEmail = $2`, [tourn_id, userEmail])
//     const participantRes = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 8]);
//     const winners = participantRes.rows.map(row => row.winner);

//     let participants = [];
//     for (let i = 0; i < winners.length; i += 2) {
//         if (winners[i + 1] != undefined) {
//             participants.push([winners[i], winners[i + 1]]);
//         }
//     }

//     res.status(200).json({participants: participants, userEmail:userEmail , isRet})

// })

// privateRouter.get("/fill/results1x1/r10",async(req,res)=>{
//     const tourn_id =req.query.id;
//     const userEmail = req.session.userEmail;
//     const isRet = await pool.query(`SELECT 1 FROM Retailers_1x1all WHERE TournamentID = $1 AND RetailerEmail = $2`, [tourn_id, userEmail])
//     const participantRes = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 9]);
//     const winners = participantRes.rows.map(row => row.winner);

//     let participants = [];
//     for (let i = 0; i < winners.length; i += 2) {
//         if (winners[i + 1] != undefined) {
//             participants.push([winners[i], winners[i + 1]]);
//         }
//     }

//     res.status(200).json({participants: participants, userEmail:userEmail , isRet})

// })

// privateRouter.get("/fill/results1x1/3dpl",async(req,res)=>{
//     const tourn_id =req.query.id;
//     const userEmail = req.session.userEmail;
//     const rounds = req.body.round;
//     const isRet = await pool.query(`SELECT 1 FROM Retailers_1x1all WHERE TournamentID = $1 AND RetailerEmail = $2`, [tourn_id, userEmail])

//     const participantRes = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, rounds]);
    

//     let participants = [];
//     let Nowinners = [];

//     for(let rew of participantRes){
//         if(row.winner === row.participant1){
//             Nowinners.push({
//                 id: id++,
//                 id_num: id_num++,
//                 participant: row.participant2,
//                 tour_name: tourn_name,
//               });
//         }
//         if(row.winner === row.participant2){
//             Nowinners.push({
//                 id: id++,
//                 id_num: id_num++,
//                 participant: row.participant1,
//                 tour_name: tourn_name,
//               });
//         }
//     }

//     for (let i = 0; i < Nowinners.length; i += 2) {
//         if (Nowinners[i + 1] != undefined) {
//             participants.push([Nowinners[i], Nowinners[i + 1]]);
//         }
//     }

//     res.status(200).json({participants: participants, userEmail:userEmail , isRet})

// })

privateRouter.get('/get/results1x1', async(req,res)=>{
    const tourn_id =req.query.id;
   

 

    const participantResR1 = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 1])

    const resultsR1 = participantResR1.rows;

    const participantResR2 = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 2])

    const resultsR2 = participantResR2.rows;


    const participantResR3 = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 3])

    const resultsR3 = participantResR3.rows;
    const participantResR4 = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 4])

    const resultsR4 = participantResR4.rows;

    const participantResR5 = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 5])

    const resultsR5 = participantResR5.rows;

    const participantResR6 = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 6])

    const resultsR6 = participantResR6.rows;
    const participantResR7 = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 7])

    const resultsR7 = participantResR7.rows;

    const participantResR8 = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 8])

    const resultsR8 = participantResR8.rows;

    const participantResR9 = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 9])

    const resultsR9 = participantResR9.rows;

    const participantResR10 = await pool.query('SELECT * FROM Results_1x1all WHERE TournamentID = $1 AND Round = $2', [tourn_id, 10])

    const resultsR10 = participantResR10.rows;
    res.status(200).json({
        resultsR1:resultsR1,
        resultsR2:resultsR2,
        resultsR3:resultsR3,
        resultsR4:resultsR4,
        resultsR5:resultsR5,
        resultsR6:resultsR6,
        resultsR7:resultsR7,
        resultsR8:resultsR8,
        resultsR9:resultsR9,
        resultsR10:resultsR10,
})
})

privateRouter.get('/get/results', async(req,res)=>{
    const tourn_id =req.query.id;
    const userEmail = req.session.userEmail;

    const type= req.query.type;
    let tablePref;

   switch (type) {
    case '1x1':
        tablePref = '1x1';
        break;

    case 'b_r':
        tablePref = 'b_r';
        break;

    default:
        return res.status(400).send('Неверный тип турнира!');
}   

    

    const participantRes= await pool.query(`SELECT * FROM Results_${tablePref} WHERE TournamentID = $1 ORDER BY Score DESC`, [tourn_id]);

    const results = participantRes.rows;
    const top3Res = await pool.query(`SELECT ParticipantEmail, Score FROM Results_${tablePref} WHERE TournamentID = $1 ORDER BY Score DESC LIMIT 3`, [tourn_id]);
    const top3 = top3Res.rows;
    res.status(200).json({results:results, userEmail:userEmail, top3:top3})
})

privateRouter.get('/get/results/team', async(req,res)=>{
    const tourn_id =req.query.id;
    const userEmail = req.session.userEmail;

    const type= req.body.type;
    let tablePref;

   switch (type) {
    case 'team':
        tablePref = 'team';
        break;

    case 'b_r_t':
        tablePref = 'b_r_t';
        break;
   
    default:
        return res.status(400).send('Неверный тип турнира!');
}   

    const ResisAdm = await pool.query('SELECT Admin FROM Users WHERE Email = $1', [userEmail])
    const isAdm = ResisAdm.rows[0].Admin;

    const participantRes= await pool.query(` SELECT r.*, t.TeamName FROM Results_${tablePref} r JOIN Teams_${tablePref} t ON r.TeamID = t.id WHERE TournamentID = $1`, [tourn_id]);

    const results = participantRes.rows;

    const top3Res = await pool.query(`SELECT r.TeamID, r.Score, t.TeamName FROM Results_${tablePref} r JOIN Teams_team t ON r.TeamID = t.id WHERE r.TournamentID = $1 ORDER BY r.Score DESC LIMIT 3`, [tourn_id]);
    const top3 = top3Res.rows;
    res.status(200).json({results:results, userEmail:userEmail, top3:top3, isAdm})
})

privateRouter.post('/user/add/participant/team', async(req,res)=>{

    const team_id =req.body.id; 
    const {participant} = req.body;

    const result = await pool.query(`SELECT t.NumOfPeople, COUNT(p.MemberEmail) AS currentParticipants FROM Teams t LEFT JOIN TeamMembers p ON t.id = p.TeamID WHERE t.id = $1 GROUP BY t.NumOfPeople;`, [team_id]);
    if(result.rows.length > 0){
        const { numofparticipants, currentparticipants } = result.rows[0];
        if (currentparticipants >= numofparticipants) {
            
            return res.status(400).send('Турнир полон!');
          }
    } else {
          
          return res.status(404).send('Турнир не найден');
    }


    const isAuth = await pool.query('SELECT 1 FROM Users WHERE email = $1', [participant]);

    if(isAuth.rows.length>0){
        
        const teamNameResult = await pool.query(`SELECT TeamName FROM Teams WHERE id = $1`, [team_id]);
        const teamName = teamNameResult.rows[0].TeamName;

        const IdREs = await pool.query("SELECT id FROM Users WHERE email = $1", [participant])
        const userID = IdREs.rows[0].id;

        await pool.query(`INSERT INTO TeamMembers (TeamID, MemberEmail) VALUES ($1, $2)`, [team_id, participant]);
        await pool.query('INSERT INTO Teams_User (id, TeamName) VALUES ($1, $2)', [userID, teamName])
        res.status(200).send('ok');
    }
    else{
        await pool.query(`INSERT INTO TeamMembers (TeamID, MemberEmail) VALUES ($1, $2)`, [team_id, participant]);
        res.status(200).send('ok');
    }
})

privateRouter.post('/user/add/participant/tournament', async(req,res)=>{
    const type= req.body.type;
    let tablePref;

   switch (type) {
    case '1x1':
        tablePref = '1x1';
        break;

    case 'b_r':
        tablePref = 'b_r';
        break;
    case '1x1all':
        tablePref = '1x1all';
        break;

    default:
        return res.status(400).send('Неверный тип турнира!');
}   

    const tournament_id =req.body.id; 
    const {participant} = req.body;

    const result = await pool.query(`SELECT t.NumOfParticipants, COUNT(p.ParticipantEmail) AS currentParticipants FROM Tournaments_${tablePref} t LEFT JOIN Participants_${tablePref} p ON t.id = p.TournamentID WHERE t.id = $1 GROUP BY t.NumOfParticipants;`, [tournament_id]);
    if(result.rows.length > 0){
        const { numofparticipants, currentparticipants } = result.rows[0];
        if (currentparticipants >= numofparticipants) {
            
            return res.status(400).send('Турнир полон!');
          }
    } else {
          
          return res.status(404).send('Турнир не найден');
    }


    const isAuth = await pool.query('SELECT 1 FROM Users WHERE  email = $1', [participant]);

    if(isAuth.rows.length>0){
        
        const tournamentNameResult = await pool.query(`SELECT TournamentName FROM Tournaments_${tablePref} WHERE id = $1`, [tournament_id]);
        const tournamentName = tournamentNameResult.rows[0].tournamentname;

        const IdREs = await pool.query("SELECT id FROM Users WHERE email = $1", [participant])
        const userID = IdREs.rows[0].id;

        await pool.query(`INSERT INTO Participants_${tablePref} (TournamentID, ParticipantEmail) VALUES ($1, $2)`, [tournament_id, participant]);
        await pool.query('INSERT INTO Tournaments_User (id, TournamentName) VALUES ($1, $2)', [userID, tournamentName])
        res.status(200).send('ok');
    }
    else{
        await pool.query(`INSERT INTO Participants_${tablePref} (TournamentID, ParticipantEmail) VALUES ($1, $2)`, [tournament_id, participant]);
        res.status(200).send('ok');
    }
})



privateRouter.post('/user/create/tournament', async(req,res)=>{
    const userEmail = req.session.userEmail;  
    const userID = req.session.userId;
    const { name,team_name, game, date, time_from, time_to} = req.body;
    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    
    const createTime = getCurrentTime();
    const type = 'team';
    const num_of_com = 2;

    const existingTourn = await pool.query('SELECT id FROM Tournaments_team WHERE TournamentName = $1', [name]);
        
    if (existingTourn.rows.length > 0) {
        return res.status(400).json({ error: 'Tournament name already exists' });
    }

    const resTourn = await pool.query('INSERT INTO Tournaments_team (TournamentName, Type, Game, NumOfCommands, Date, TimeFrom, TimeTo, CreateTime) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, TournamentName', [name,type, game, num_of_com, date, time_from, time_to, createTime])
    const TournID= resTourn.rows[0].id;
    const TournName= resTourn.rows[0].TournamentName;
    await pool.query('INSERT INTO Retailers_team (TournamentID, RetailerEmail) VALUES ($1, $2)', [TournID, userEmail])
   await pool.query('INSERT INTO Retailers_team (TournamentID, RetailerEmail) VALUES ($1, $2)', [TournID, 'admin@gmail.com'])


   await pool.query('INSERT INTO Tournaments_User (id, TournamentName) VALUES ($1, $2)', [userID, TournName])
   await pool.query('INSERT INTO Tournaments_User (id, TournamentName) VALUES ($1, $2)', [5, TournName])


    await pool.query('INSERT INTO Teams_team (TournamentID, TeamName) VALUES ($1, $2) RETURNING id', [TournID, team_name])
    
    res.status(200).send('ok');
})

privateRouter.post('/user/create/tournament/battle-royal',async(req,res)=>{
    const userID = req.session.userId;
    const userEmail = req.session.userEmail;
    const format = 1;
    const { name, game,num_of_part, date, time_from, time_to} = req.body;
    const type = 'b_r'
    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    
    const createTime = getCurrentTime();

    const existingTourn = await pool.query('SELECT id FROM Tournaments_b_r WHERE TournamentName = $1', [name]);
        
    if (existingTourn.rows.length > 0) {
        return res.status(400).json({ error: 'Tournament name already exists' });
    }
    const resTourn = await pool.query('INSERT INTO Tournaments_b_r (TournamentName, Type, Game, Format, NumOfParticipants, Date, TimeFrom, TimeTo, CreateTime) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, TournamentName',
    [name, type, game, format, num_of_part, date, time_from, time_to, createTime]);

    const tourn_Id= resTourn.rows[0].id;
    const TournName = resTourn.rows[0].TournamentName;
    await pool.query('INSERT INTO Retailers_b_r (TournamentID, RetailerEmail) VALUES ($1, $2)', [tourn_Id, userEmail])

    await pool.query('INSERT INTO Retailers_b_r (TournamentID, RetailerEmail) VALUES ($1, $2)', [tourn_Id, 'admin@gmail.com']);


    await pool.query('INSERT INTO Tournaments_User (id, TournamentName) VALUES ($1, $2)', [userID, TournName])
    await pool.query('INSERT INTO Tournaments_User (id, TournamentName) VALUES ($1, $2)', [5, TournName])

    await pool.query(' INSERT INTO Participants_b_r (TournamentID, ParticipantEmail) VALUES ($1, $2)',[tourn_Id, userEmail]);
    res.status(200).send('ok');
})


privateRouter.post('/user/create/tournament/battle-royal/team',async(req,res)=>{
    const userID = req.session.userId;
    const userEmail = req.session.userEmail;
    const { name, team_name, game,num_of_part, date, time_from, time_to} = req.body;

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    
    const createTime = getCurrentTime();
    const type = 'b_r_t';

    const existingTourn = await pool.query('SELECT id FROM Tournaments_b_r_t WHERE TournamentName = $1', [name]);
        
    if (existingTourn.rows.length > 0) {
        return res.status(400).json({ error: 'Tournament name already exists' });
    }

    const resTourn = await pool.query('INSERT INTO Tournaments_b_r_t (TournamentName, Type, Game, NumOfParticipants, Date, TimeFrom, TimeTo, CreateTime) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, TournamentName', [ name,type, game,num_of_part, date, time_from, time_to, createTime]);

    const tourn_Id= resTourn.rows[0].id;
    const TournName = resTourn.rows[0].TournamentName;
    await pool.query('INSERT INTO Retailers_b_r_t (TournamentID, RetailerEmail) VALUES ($1, $2)', [tourn_Id, userEmail])
    
    await pool.query('INSERT INTO Retailers_b_r_t (TournamentID, RetailerEmail) VALUES ($1, $2)', [tourn_Id, 'admin@gmail.com']);


    await pool.query('INSERT INTO Tournaments_User (id, TournamentName) VALUES ($1, $2)', [userID, TournName])
    await pool.query('INSERT INTO Tournaments_User (id, TournamentName) VALUES ($1, $2)', [5, TournName])
    await pool.query('INSERT INTO Teams_b_r_t (TournamentID, TeamName), VALUES ($1, $2) RETURNING id', [tourn_Id, team_name])
  
    res.status(200).send('ok');
})


privateRouter.post('/user/create/tournament/1x1',async(req,res)=>{
    const userID = req.session.userId;
    const userEmail = req.session.userEmail;
    const { name, game, date, time_from, time_to} = req.body;
    const type = '1x1';
    const num_of_part = 2;
    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    
    const createTime = getCurrentTime();
    const format = 1;

    const existingTourn = await pool.query('SELECT id FROM Tournaments_1x1 WHERE TournamentName = $1', [name]);
        
    if (existingTourn.rows.length > 0) {
        return res.status(400).json({ error: 'Tournament name already exists' });
    }

    const resTourn = await pool.query('INSERT INTO Tournaments_1x1 (TournamentName, Type, Game, Format, NumOfParticipants, Date, TimeFrom, TimeTo, CreateTime) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, TournamentName', [ name,type, game,format, num_of_part, date, time_from, time_to, createTime]);

    const tourn_Id = resTourn.rows[0].id;
    const TournName = resTourn.rows[0].TournamentName;
    await pool.query('INSERT INTO Retailers_1x1 (TournamentID, RetailerEmail) VALUES ($1, $2)', [tourn_Id, userEmail])
    await pool.query('INSERT INTO Retailers_1x1 (TournamentID, RetailerEmail) VALUES ($1, $2)', [tourn_Id, 'admin@gmail.com'])

    await pool.query('INSERT INTO Tournaments_User (id, TournamentName) VALUES ($1, $2)', [userID, TournName])
    await pool.query('INSERT INTO Tournaments_User (id, TournamentName) VALUES ($1, $2)', [5, TournName])

    await pool.query('INSERT INTO Participants_1x1 (TournamentID, ParticipantEmail) VALUES ($1, $2)', [tourn_Id, userEmail])

    res.status(200).send('ok');
});


privateRouter.post('/user/add/tournament/1x1',async(req,res)=>{

    const tourn_id = req.body.id;
    const tourn_type = req.body.type;
    const userEmail = req.session.userEmail;
    const userID = req.session.userId;

   let tablePref;

   switch (tourn_type) {
    case '1x1':
        tablePref = '1x1';
        break;
    case '1x1all':
        tablePref = '1x1all';
        break;
    case 'b_r':
        tablePref = 'b_r';
        break;
    default:
        return res.status(400).send('Неверный тип турнира!');
}   


    const checkResult = await pool.query(`SELECT 1 FROM Participants_${tablePref} WHERE TournamentID = $1 AND ParticipantEmail = $2`, [tourn_id, userEmail]);

    if (checkResult.rows.length > 0) {
        
        return res.status(400).send('Вы уже участвуете в этом турнире!');
      }

    const result = await pool.query(`SELECT t.NumOfParticipants, COUNT(p.ParticipantEmail) AS currentParticipants FROM Tournaments_${tablePref} t LEFT JOIN Participants_${tablePref} p ON t.id = p.TournamentID WHERE t.id = $1 GROUP BY t.NumOfParticipants;`, [tourn_id]);
    if(result.rows.length > 0){
        const { numofparticipants, currentparticipants } = result.rows[0];
        if (currentparticipants >= numofparticipants) {
            
            return res.status(400).send('Турнир полон!');
          }
    } else {
          
          return res.status(404).send('Турнир не найден');
    }

    await pool.query(`INSERT INTO Participants_${tablePref} (TournamentID, ParticipantEmail) VALUES ($1, $2)`, [tourn_id, userEmail]);
    
    const tournamentNameResult = await pool.query(`SELECT TournamentName FROM Tournaments_${tablePref} WHERE id = $1`, [tourn_id]);
    const tournamentName = tournamentNameResult.rows[0].tournamentname;

    await pool.query('INSERT INTO Tournaments_User (id, TournamentName) VALUES ($1, $2)', [userID, tournamentName])

    res.status(200).send('ok');

})

privateRouter.put('/profile/edit',upload.single('image'), async(req,res)=>{
    const userEmail = req.session.userEmail;
    
    const { username, name, age } = req.body;
    
    let image = null;
    if (req.file) {
        image = req.file.path;
    }
    

    await pool.query('UPDATE users SET username = COALESCE($1, username), name = COALESCE($2, name), age = COALESCE($3, age), image = COALESCE($4, image) WHERE email = $5',[username, name, age, image, userEmail]
    );
    res.status(200).send('ok');
})

privateRouter.post ('/user/create/team', async(req,res)=>{
    const userID = req.session.userId;
    const userEmail = req.session.userEmail;

    const {name, num_of_part}=req.body;

    const existingTeam = await pool.query('SELECT id FROM Teams WHERE TournamentName = $1', [name]);
        
    if (existingTeam.rows.length > 0) {
        return res.status(400).json({ error: 'Tournament name already exists' });
    }

   const teamRes =  await pool.query('INSERT INTO Teams (TeamName, NumOfPeople, RetailerEmail) VALUES($1, $2, $3) RETURNING id, TeamName', [name, num_of_part, userEmail]);

    const team_id = teamRes.rows[0].id;
    const teamName = teamRes.rows[0].TeamName;
   await pool.query('INSERT INTO TeamMembers (TeamID, MemberEmail) VALUES($1, $2)', [team_id, userEmail])

   await pool.query('INSERT INTO Teams_User (id, TeamName) VALUES ($1, $2)', [userID, teamName])
   res.status(200).send('ok');

})

privateRouter.post('/user/add/team', async(req,res)=>{
    const team_id = req.body.id;
    const userEmail = req.session.userEmail;
    const userID = req.session.userId;

    const checkResult = await pool.query('SELECT 1 FROM TeamMembers WHERE TeamID = $1 AND MemberEmail = $2', [team_id, userEmail]);

    if (checkResult.rows.length > 0) {
        
        return res.status(400).send('Вы уже участвуете в этой команде!');
      }

    const result = await pool.query('SELECT t.NumOfPeople, COUNT(tm.MemberEmail) AS currentParticipants FROM Teams t LEFT JOIN TeamMembers tm ON t.id = tm.TeamID WHERE t.id = $1 GROUP BY t.NumOfPeople;', [team_id]);


    if(result.rows.length > 0){
        const { numofparticipants, currentparticipants } = result.rows[0];
        if (currentparticipants >= numofparticipants) {
            
            return res.status(400).send('Команда полна!');
        }
    } else {
        
        return res.status(404).send('Команда не найдена');
    }
    await pool.query('INSERT INTO TeamMembers (TeamID, MemberEmail) VALUES ($1, $2)', [team_id, userEmail])


    const teamNameResult = await pool.query('SELECT TeamName FROM Teams WHERE id = $1', [team_id]);

    const teamName = teamNameResult.rows[0].TeamName;

    await pool.query('INSERT INTO Teams_User (id, TeamName)',[userID, teamName] )
    res.status(200).send('ok');
})


privateRouter.delete('/user/remove/from/team', async(req,res)=>{
    const userEmail = req.session.userEmail;
    const userID = req.session.userId;
  
    const team_id = req.body.id;

    const findTeam = await pool.query('SELECT TeamName, RetailerEmail FROM Teams WHERE id = $1', [team_id])

    const teamName = findTeam.rows[0].TeamName;
    const retailer = findTeam.rows[0].RetailerEmail;

    if (retailer === email) {
        
        res.status(400).send('Вы не можете выйти из команды, так как вы являетесь ритейлером')
        return;
    }

    await pool.query('DELETE FROM TeamMembers WHERE TeamID = $1 AND MemberEmail = $2', [team_id, userEmail]);
    
    await pool.query('DELETE FROM TeamMembers WHERE TeamID = $1 AND MemberEmail = $2', [team_id, userEmail])

    await pool.query('DELETE FROM Teams_User  WHERE TeamName=$1 AND id = $2', [teamName, userID]);

    res.status(200).send('ok');
})

privateRouter.put('/user/give/captain',async(req,res)=>{
    const userEmail = req.session.userEmail;
    const {newCapName} = req.body
    const teamRes = await pool.query("SELECT TeamID FROM TeamMembers WHERE MemberEmail = $1", [userEmail]);

    const team_id = teamRes.rows[0].TeamID;

    await pool.query('UPDATE Teams SET RetailerEmail = $1 WHERE id = $2',[newCapName,team_id])
    res.status(200).send('ok');
})

privateRouter.delete('/user/delete/person', async(req,res)=>{
    const userEmail = req.session.userEmail;
    const {email} = req.body;
    const teamRes = await pool.query("SELECT TeamID FROM TeamMembers WHERE MemberEmail = $1", [userEmail]);

    if (teamRes.rows.length === 0) {
        return res.status(404).send('Пользователь не состоит в команде');
    }

    const team_id = teamRes.rows[0].teamid;

    
    const memberRes = await pool.query("SELECT 1 FROM TeamMembers WHERE MemberEmail = $1 AND TeamID = $2", [email, team_id]);

    if (memberRes.rows.length === 0) {
        return res.status(404).send('Участник не найден в команде');
    }

   
    await pool.query('DELETE FROM TeamMembers WHERE MemberEmail = $1 AND TeamID = $2', [email, team_id]);

    res.status(200).send('ok');
  
})


privateRouter.delete('/user/delete/team',async(req,res)=>{
    const userEmail = req.session.userEmail;
    const userID = req.session.userId;
  
    const team_id = req.body.id;
    const TeamRes = await pool.query('SELECT TeamName, RetailerEmail FROM Teams WHERE id = $1',[team_id])

    const retailer=TeamRes.rows[0].RetailerEmail;
    

    const teamName = TeamRes.rows[0].TeamName;

    if (retailer !== userEmail) {
        res.status(400).send('У вас нет прав для удаления этой команды')
        return;
    }
    await pool.query('DELETE FROM TeamMembers WHERE TeamID=$1', [team_id]);

    await pool.query('DELETE FROM Teams  WHERE id=$1', [team_id]);

    await pool.query('DELETE FROM Teams_User  WHERE TeamName=$1 AND id = $2', [teamName, userID]);
    res.status(200).send('ok')
})


privateRouter.post('/user/create/tournament/1x1/All',async(req,res)=>{

    const userID = req.session.userId;
    const userEmail = req.session.userEmail;
    const { name, game,num_of_part, date, time_from, time_to} = req.body;
    const type = '1x1all';

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    
    const createTime = getCurrentTime();
    const format = 1;

    const existingTourn = await pool.query('SELECT id FROM Tournaments_1x1all WHERE TeamName = $1', [name]);
        
    if (existingTourn.rows.length > 0) {
        return res.status(400).json({ error: 'Tournament name already exists' });
    }
    const resTourn = await pool.query(' INSERT INTO Tournaments_1x1all (TournamentName, Type, Game, Format, NumOfParticipants, Date, TimeFrom, TimeTo, CreateTime) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, TournamentName', [ name,type, game,format, num_of_part, date, time_from, time_to, createTime]);

    const tourn_Id = resTourn.rows[0].id;
    const TournName = resTourn.rows[0].TournamentName;
    await pool.query('INSERT INTO Retailers_1x1all (TournamentID, RetailerEmail) VALUES ($1, $2)', [tourn_Id, userEmail])
    await pool.query('INSERT INTO Retailers_1x1all (TournamentID, RetailerEmail) VALUES ($1, $2)', [tourn_Id, 'admin@gmail.com'])

    await pool.query('INSERT INTO Tournaments_User (id, TournamentName) VALUES ($1, $2)', [userID, TournName])
    await pool.query('INSERT INTO Tournaments_User (id, TournamentName) VALUES ($1, $2)', [5, TournName])

    await pool.query('INSERT INTO Participants_1x1all (TournamentID, ParticipantEmail) VALUES ($1, $2)', [tourn_Id, userEmail])

    res.status(200).send('ok');

})

privateRouter.post('/user/add/tournament/team', async(req,res)=>{

    const tournament_id = req.body.tournament_id; 
    const userEmail = req.session.userEmail; 
    const tourn_type = req.body.type;
    
    let tablePref;

    switch (tourn_type) {
        case 'b_r_t':
            tablePref = 'b_r_t';
            break;
        case 'team':
            tablePref = 'team';
            break;
        default:
            return res.status(400).send('Неверный тип турнира!');
    }   

    const teamRes = await pool.query('SELECT * FROM Teams WHERE RetailerEmail = $1', [userEmail]);

    if (teamRes.rows.length === 0) {
        return res.status(400).send('Команда не найдена');
    }

    
    const team_name = teamRes.rows[0].TeamName;

    const check = await pool.query(`SELECT 1 FROM Teams_${tablePref} WHERE  TournamentID = $1 AND TeamName = $2`,[tournament_id, team_name]);


    if (check.rows.length > 0) {
        return res.status(400).send('Команда уже участвует в этом турнире');
    }

    const tournRes = await pool.query(`SELECT t.NumOfCommands, COUNT(tt.TeamName) AS currentTeams FROM Tournaments_${tablePref} t LEFT JOIN Teams_${tablePref} tt ON t.id = tt.TournamentID WHERE t.id = $1 GROUP BY t.NumOfCommands`, [tournament_id]);

    if (tournRes.rows.length > 0) {
        const { numofcommands, currentteams } = tournamentResult.rows[0];
        if (currentteams >= numofcommands) {
            return res.status(400).send('Турнир полон');
        }
    } else {
        return res.status(404).send('Турнир не найден');
    }

    await pool.query(`INSERT INTO Teams_${tablePref} (TournamentID, TeamName) VALUES ($1, $2)`, [tournament_id, team_name]);

    res.status(200).send('ok');

})


privateRouter.post('/user/rounds/tournament/addresult', async(req, res)=>{
    const tourn_id = req.body.tournament_id; 
    const type = req.body.type;
    const {participant, score} = req.body;
   
    let tablePref;
    let RoundName;
    switch (type) {
        case '1x1':
            tablePref = '1x1';
            RoundName = '1x1';
            break;
        
        case 'b_r':
            tablePref = 'b_r';
            RoundName = 'Battle_Royal'
            break;
        default:
            return res.status(400).send('Неверный тип турнира!');
    }   

 await pool.query(`INSERT INTO Results_${tablePref} (TournamentID, RoundName, ParticipantEmail, Score) VALUES($1,$2,$3,$4)`,[tourn_id, RoundName, participant, score])
 res.status(200).send('ok');

})


privateRouter.post('/user/rounds/tournament/team/addresult', async(req, res)=>{
    const tourn_id = req.body.tournament_id; 
    const type = req.body.type;
const {team, score} = req.body;
   
    let tablePref;
    let RoundName;
    switch (type) {
        case 'team':
            tablePref = 'team';
            RoundName = 'team';
            break;
        
        case 'b_r_t':
            tablePref = 'b_r_t';
            RoundName = 'Battle_Royal_teams'
            break;
        default:
            return res.status(400).send('Неверный тип турнира!');
    }   
    const teamRes = await pool.query(`SELECT id FROM Teams_${tablePref} WHERE TournamentID=$1,TeamName=$2`, [tourn_id, team]);

    const team_id = teamRes.rows[0].id;

    await pool.query(`INSERT INTO Results_${tablePref} (TournamentID, RoundName, TeamID, Score) VALUES($1,$2,$3,$4)`,[tourn_id, RoundName, team_id, score])

    res.status(200).send('ok');

})


privateRouter.post('/user/rounds/tournament/1x1A/r1', async(req,res)=>{
    const tourn_id = req.body.tournament_id; 
    const round_name = 1;

    const {participant1,participant2,score1,score2} = req.body;
    let winner;
    if(Number(score1)>Number(score2)){
        winner = participant1;
    }
    if(Number(score1)<Number(score2)){
        winner = participant2;
    }

    await pool.query('INSERT INTO Results_1x1all (TournamentID,Round, Participant1, Participant2, Score1, Score2, Winner) VALUES ($1, $2, $3, $4, $5, $6, $7)', [tourn_id, round_name,participant1,participant2,score1,score2, winner ])
    res.status(200).send('ok');


})

privateRouter.post('/user/rounds/tournament/1x1A/r2', async(req,res)=>{
    const tourn_id = req.body.tournament_id; 
    const round_name = 2;

    const {participant1,participant2,score1,score2} = req.body;
    let winner;
    if(Number(score1)>Number(score2)){
        winner = participant1;
    }
    if(Number(score1)<Number(score2)){
        winner = participant2;
    }

    await pool.query('INSERT INTO Results_1x1all (TournamentID, Round, Participant1, Participant2, Score1, Score2, Winner) VALUES ($1, $2, $3, $4, $5, $6, $7)', [tourn_id, round_name,participant1,participant2,score1,score2, winner ])
    res.status(200).send('ok');

    
})
privateRouter.post('/user/rounds/tournament/1x1A/r3', async(req,res)=>{
    const tourn_id = req.body.tournament_id; 
    const round_name = 3;

    const {participant1,participant2,score1,score2} = req.body;
    let winner;
    if(Number(score1)>Number(score2)){
        winner = participant1;
    }
    if(Number(score1)<Number(score2)){
        winner = participant2;
    }

    await pool.query('INSERT INTO Results_1x1all (TournamentID, Round, Participant1, Participant2, Score1, Score2, Winner) VALUES ($1, $2, $3, $4, $5, $6, $7)', [tourn_id, round_name,participant1,participant2,score1,score2, winner ])
    res.status(200).send('ok');

    
})
privateRouter.post('/user/rounds/tournament/1x1A/r4', async(req,res)=>{
    const tourn_id = req.body.tournament_id; 
    const round_name = 4;

    const {participant1,participant2,score1,score2} = req.body;
    let winner;
    if(Number(score1)>Number(score2)){
        winner = participant1;
    }
    if(Number(score1)<Number(score2)){
        winner = participant2;
    }

    await pool.query('INSERT INTO Results_1x1all (TournamentID,Round, Participant1, Participant2, Score1, Score2, Winner) VALUES ($1, $2, $3, $4, $5, $6, $7)', [tourn_id, round_name,participant1,participant2,score1,score2, winner ])
    res.status(200).send('ok');

    
})
privateRouter.post('/user/rounds/tournament/1x1A/r5', async(req,res)=>{
    const tourn_id = req.body.tournament_id; 
    const round_name = 5;

    const {participant1,participant2,score1,score2} = req.body;
    let winner;
    if(Number(score1)>Number(score2)){
        winner = participant1;
    }
    if(Number(score1)<Number(score2)){
        winner = participant2;
    }

    await pool.query('INSERT INTO Results_1x1all (TournamentID,Round, Participant1, Participant2, Score1, Score2, Winner) VALUES ($1, $2, $3, $4, $5, $6, $7)', [tourn_id, round_name,participant1,participant2,score1,score2, winner ])
    res.status(200).send('ok');

    
})
privateRouter.post('/user/rounds/tournament/1x1A/r6', async(req,res)=>{
    const tourn_id = req.body.tournament_id; 
    const round_name = 6;

    const {participant1,participant2,score1,score2} = req.body;
    let winner;
    if(Number(score1)>Number(score2)){
        winner = participant1;
    }
    if(Number(score1)<Number(score2)){
        winner = participant2;
    }

    await pool.query('INSERT INTO Results_1x1all (TournamentID,Round, Participant1, Participant2, Score1, Score2, Winner) VALUES ($1, $2, $3, $4, $5, $6, $7)', [tourn_id, round_name,participant1,participant2,score1,score2, winner ])
    res.status(200).send('ok');

    
})
privateRouter.post('/user/rounds/tournament/1x1A/r7', async(req,res)=>{
    const tourn_id = req.body.tournament_id; 
    const round_name = 7;

    const {participant1,participant2,score1,score2} = req.body;
    let winner;
    if(Number(score1)>Number(score2)){
        winner = participant1;
    }
    if(Number(score1)<Number(score2)){
        winner = participant2;
    }

    await pool.query('INSERT INTO Results_1x1all (TournamentID,Round, Participant1, Participant2, Score1, Score2, Winner) VALUES ($1, $2, $3, $4, $5, $6, $7)', [tourn_id, round_name,participant1,participant2,score1,score2, winner ])
    res.status(200).send('ok');

    
})
privateRouter.post('/user/rounds/tournament/1x1A/r8', async(req,res)=>{
    const tourn_id = req.body.tournament_id; 
    const round_name = 8;

    const {participant1,participant2,score1,score2} = req.body;
    let winner;
    if(Number(score1)>Number(score2)){
        winner = participant1;
    }
    if(Number(score1)<Number(score2)){
        winner = participant2;
    }

    await pool.query('INSERT INTO Results_1x1all (TournamentID,Round, Participant1, Participant2, Score1, Score2, Winner) VALUES ($1, $2, $3, $4, $5, $6, $7)', [tourn_id, round_name,participant1,participant2,score1,score2, winner ])
    res.status(200).send('ok');

    
})
privateRouter.post('/user/rounds/tournament/1x1A/r9', async(req,res)=>{
    const tourn_id = req.body.tournament_id; 
    const round_name = 9;

    const {participant1,participant2,score1,score2} = req.body;
    let winner;
    if(Number(score1)>Number(score2)){
        winner = participant1;
    }
    if(Number(score1)<Number(score2)){
        winner = participant2;
    }

    await pool.query('INSERT INTO Results_1x1all (TournamentID,Round, Participant1, Participant2, Score1, Score2, Winner) VALUES ($1, $2, $3, $4, $5, $6, $7)', [tourn_id, round_name,participant1,participant2,score1,score2, winner ])
    res.status(200).send('ok');

    
})
privateRouter.post('/user/rounds/tournament/1x1A/r10', async(req,res)=>{
    const tourn_id = req.body.tournament_id; 
    const round_name = 10;

    const {participant1,participant2,score1,score2} = req.body;
    let winner;
    if(Number(score1)>Number(score2)){
        winner = participant1;
    }
    if(Number(score1)<Number(score2)){
        winner = participant2;
    }

    await pool.query('INSERT INTO Results_1x1all (TournamentID,Round, Participant1, Participant2, Score1, Score2, Winner) VALUES ($1, $2, $3, $4, $5, $6, $7)', [tourn_id, round_name,participant1,participant2,score1,score2, winner ])
    res.status(200).send('ok');

    
})
privateRouter.post('/user/rounds/tournament/1x1A/33', async(req,res)=>{
    const tourn_id = req.body.tournament_id; 
    const round_name = 33;

    const {participant1,participant2,score1,score2} = req.body;
    let winner;
    if(Number(score1)>Number(score2)){
        winner = participant1;
    }
    if(Number(score1)<Number(score2)){
        winner = participant2;
    }

    await pool.query('INSERT INTO Results_1x1all (TournamentID,Round, Participant1, Participant2, Score1, Score2, Winner) VALUES ($1, $2, $3, $4, $5, $6, $7)', [tourn_id, round_name,participant1,participant2,score1,score2, winner ])
    res.status(200).send('ok');

    
})

privateRouter.get('/user/admin', async(req,res)=>{
    const result = await pool.query('SELECT * FROM Users ORDER BY id DESC')
    if(result.rows.length>0){
        res.status(200).json({users: result.rows})
    }
})

privateRouter.delete('/user/admin/delete/users', async(req,res)=>{
    const user_id = req.body.id;
    await pool.query('DELETE FROM Users WHERE id = $1', [user_id]);

   const result = await pool.query('SELECT * FROM Users')

   if(result.rows.length>0){
    res.status(200).json({users: result.rows})
}
})
privateRouter.put('/user/admin/give/ban', async(req,res)=>{
    const user_id = req.body.id;
    
    await pool.query('UPDATE Users SET Banned = true WHERE id = $1', [user_id])

    const result = await pool.query('SELECT * FROM Users');

    if(result.rows.length>0){
        res.status(200).json({users: result.rows})
    }

})

privateRouter.put('/user/admin/give/unban', async(req,res)=>{
    const user_id = req.body.id;
    
    await pool.query('UPDATE Users SET Banned = false WHERE id = $1', [user_id])

    const result = await pool.query('SELECT * FROM Users');

    if(result.rows.length>0){
        res.status(200).json({users: result.rows})
    }

})

privateRouter.post('/user/admin/add/news',upload.single('image'), async(req,res)=>{
    const user_id = req.session.userId;
    const userEmail = req.session.userEmail
    const {title, info} = req.body;

    const image = req.file.path;
    await pool.query("INSERT INTO News (Title, Information, Image, AdminEmail) VALUES($1,$2, $3, $4)", [title, info, image, userEmail]);

    await pool.query('INSERT INTO News_Admin (id, NewsItem) VALUES ($1,$2)', [user_id, title]);
    res.status(200).send('ok');
})
privateRouter.put('/user/admin/edit/news', async(req,res)=>{
    const id = req.body.id;

    const {title, information} = req.body;

    const image = req.file.path;
    await pool.query('UPDATE News SET title = COALESCE($1, title), information = COALESCE($2, information), image = COALESCE($3, image) WHERE id = $4', [title, information, image, id]);

   
    res.status(200).send('ok');
    
})

privateRouter.get('/user/admin/get/edit/news', async(req,res)=>{
    const id = req.query.id;
    const userEmail = req.session.userEmail;

    const results = await pool.query('SELECT * FROM News WHERE id = $1', [id])
    if(results.rows.length>0){
        res.status(200).json({news: results.rows, userEmail:userEmail})
    }
})


privateRouter.delete('/user/admin/delete/news', async(req,res)=>{
    const id = req.query.id;
    
    await pool.query('DELETE FROM News WHERE id = $1', [id]);
    res.status(200).send('ok');
})

privateRouter.get("/adm-news", async(req,res)=>{
    const userEmail = req.session.userEmail;

    const results = await pool.query('SELECT * FROM news ORDER BY id DESC');

    if(results.rows.length>0){
        res.status(200).json({news: results.rows})
    }
})

privateRouter.get("/user/sign-out", async(req,res)=>{
        const email = req.session.userEmail
        req.session.auth = false;
        await pool.query("UPDATE users SET status = 'ofline' WHERE email = $1", [email]);
         req.session.destroy((err) => {
            if (err) {
              console.error("Ошибка разрушения сессии:", err);
              return res.status(500).send("Ошибка сервера");
            }
        
            res.redirect("/");
          });
        })



module.exports = privateRouter;
