const fs = require('fs');
const FileType = require("file-type");
const PhoneNumber = require("awesome-phonenumber");
const {
  downloadContentFromMessage,
  getContentType,
  generateWAMessage,
  generateWAMessageContent,
  generateWAMessageFromContent,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  proto,
  jidDecode
} = require(fs.existsSync("./node_modules/baileys") ? "baileys" : fs.existsSync("./node_modules/@adiwajshing/baileys") ? "@adiwajshing/baileys" : "@whiskeysockets/baileys");
const Exif = new (require("./Exif"))();
const Func = new (require("./Function"))();
const {
  upload
} = require("@neoxr/helper");
module.exports = class Message {
  ["tags"] = {
    'album': "Sam Music",
    'APIC': Buffer.from("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", "base64")
  };
  ["mention"] = X => [...X.matchAll(/@([0-9]{5,16}|0)/g)].map(D => D[1] + "@s.whatsapp.net");
  ["createMessageFunction"] = (X, D = false) => {
    const W = {
      'pPpaz': function (p, x) {
        return p(x);
      },
      'hcfLL': function (p, d) {
        return p + d;
      },
      'gjAwV': function (p, x, d, M) {
        return p(x, d, M);
      },
      'fGzxU': function (p, x) {
        return p(x);
      },
      'NEKxn': function (p, d) {
        return p in d;
      },
      'CxmqK': "contextInfo",
      'kqikV': "composing",
      'kcNcQ': "bot",
      'SOVPL': "biz",
      'RkHxx': "message",
      'uuSHx': function (p, x) {
        return p(x);
      },
      'JVuSP': function (p, x) {
        return p(x);
      },
      'xvfeX': "https://telegra.ph/file/d5a48b03b80791b50717f.jpg",
      'oWcfp': "© neoxr-bot v4",
      'Waxir': function (p, d) {
        return p + d;
      },
      'gKRhU': "https://telegra.ph/?id=",
      'rCXFN': "status@broadcast",
      'dOEra': function (p, d) {
        return p || d;
      },
      'pYNLL': "© neoxr-bot",
      'SDwYB': function (p, x) {
        return p(x);
      },
      'NOIMr': function (p, d) {
        return p + d;
      },
      'DWlLo': function (p, d) {
        return p === d;
      },
      'YzBMO': "admin",
      'KvKGu': function (p, d) {
        return p === d;
      },
      'krFRL': "superadmin",
      'EJARw': "application",
      'soBei': "document",
      'UlnhU': function (p, x, d) {
        return p(x, d);
      },
      'OFfff': function (p, d) {
        return p + d;
      },
      'oNTLs': function (p, x, d) {
        return p(x, d);
      },
      'odYXS': "3|1|0|2|4",
      'lYSDq': function (p, x, d) {
        return p(x, d);
      },
      'DEIfK': function (p, d) {
        return p != d;
      },
      'NZEbi': "conversation",
      'DOahg': function (p, d) {
        return p || d;
      },
      'BzYig': function (p, d) {
        return p < d;
      },
      'zKJer': "base64",
      'PGRXI': function (p, x, d) {
        return p(x, d);
      },
      'ZWhgz': "⬢⬡⬡⬡⬡⬡⬡⬡⬡⬡ 10%",
      'EhsXA': "⬢⬢⬢⬡⬡⬡⬡⬡⬡⬡ 30%",
      'kBFXr': "⬢⬢⬢⬢⬢⬡⬡⬡⬡⬡ 50%",
      'YKeEW': "⬢⬢⬢⬢⬢⬢⬢⬢⬢⬢ 100%",
      'nCYFv': "⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡ 0%",
      'ePfgA': function (p, x, d) {
        return p(x, d);
      },
      'sDlvz': function (p, x, d) {
        return p(x, d);
      },
      'XYCac': "NATIVE_FLOW",
      'lsldK': "RESPONSE",
      'LISVJ': function (p, x, d) {
        return p(x, d);
      },
      'IAUEL': function (p, x, d) {
        return p(x, d);
      },
      'huXmp': function (p, x, d) {
        return p(x, d);
      },
      'ugyce': function (p, x, d) {
        return p(x, d);
      },
      'NxJDD': "PRODUCT",
      'HFgVU': "DOCUMENT",
      'SWAXl': "LOCATION",
      'VOzhv': "IMAGE",
      'MROit': "VIDEO",
      'fptuA': "EMPTY",
      'JUmtv': "italic",
      'redse': ".mp3",
      'ZYNwW': function (p, d) {
        return p == d;
      },
      'UGecb': "m4a",
      'HhTuS': "recording",
      'FSuvl': function (p, d) {
        return p == d;
      }
    };
    X.decodeJid = p => {
      if (!p) {
        return p;
      }
      if (/:\d+@/gi.test(p)) {
        let x = jidDecode(p) || {};
        return x.user && x.server && x.user + '@' + x.server || p;
      } else {
        return p;
      }
    };
    X.generateMessage = async (p, x, d = {}, M = {}) => {
      let v = await generateWAMessage(p, x, d);
      const l = getContentType(v.message);
      if ("contextInfo" in x) {
        v.message[l].contextInfo = {
          ...v.message[l].contextInfo,
          ...x.contextInfo
        };
      }
      if ("contextInfo" in M) {
        v.message[l].contextInfo = {
          ...v.message[l].contextInfo,
          ...M.contextInfo
        };
      }
      return await X.relayMessage(p, v.message, {
        'messageId': v.key.id
      }).then(() => v);
    };
    X.sendFromAI = async (p, x, d, M = {}) => {
      const v = [];
      v.push({
        'attrs': {
          'biz_bot': '1'
        },
        'tag': "bot"
      });
      v.push({
        'attrs': {},
        'tag': "biz"
      });
      const l = generateWAMessageFromContent(p, {
        'extendedTextMessage': {
          'text': x,
          'contextInfo': {
            'mentionedJid': this.mention(x),
            ...M
          },
          'message': {
            'messageContextInfo': {
              'messageSecret': Func.random(32),
              'supportPayload': JSON.stringify({
                'version': 0x1,
                'is_ai_message': true,
                'should_show_system_message': true,
                'ticket_id': 0x5eece88464ef5
              })
            }
          }
        }
      }, {
        'userJid': X.user.jid,
        'quoted': d,
        ...(D ? {
          'ephemeralExpiration': d?.["expiration"] || 0
        } : {})
      });
      X.relayMessage(p, l.message, {
        'messageId': l.key.id,
        'additionalNodes': v
      });
      return l;
    };
    
    X.sendMessageModify = async (p, x, d, M, v = {}) => {
      if (M.thumbnail && !Func.isUrl(M.thumbnail)) {
        var {
          file: l
        } = await Func.getFile(M.thumbnail);
        var Q = await (await upload(fs.readFileSync(l))).data.url;
      } else {
        if (M.thumbnail && Buffer.isBuffer(M.thumbnail)) {
          var Q = await (await upload(M.thumbnail)).data.url;
        } else {
          if (M.thumbnail && Func.isUrl(M.thumbnail)) {
            var Q = M.thumbnail;
          } else {
            var Q = "https://i.postimg.cc/L6PLVMsv/rettiest.jpg";
          }
        }
      }
      return X.generateMessage(p, {
        'text': x,
        ...v,
        'contextInfo': {
          'mentionedJid': this.mention(x),
          'externalAdReply': {
            'title': M.title || "Starlight Bot",
            'body': M.body || null,
            'mediaType': 0x1,
            'thumbnailUrl': 'https://i.postimg.cc/L6PLVMsv/rettiest.jpg',
            'thumbnail': await Func.fetchBuffer("https://i.postimg.cc/L6PLVMsv/rettiest.jpg"),
            'sourceUrl': 'https://whatsapp.com/channel/0029VasSQy7DDmFSSfbKYv3N',
            'showAdAttribution': !!(M.ads && M.ads),
            'renderLargerThumbnail': !!(M.largeThumb && M.largeThumb),
            'containsAutoReply': false
          }
        }
      }, {
        'quoted': d,
        ...(D ? {
          'ephemeralExpiration': d?.["expiration"] || 0
        } : {})
      });
    }
    X.sendMessageModifyV2 = async (p, x, d, M, v = {}) => {
      if (M.thumbnail && !Func.isUrl(M.thumbnail)) {
        var {
          file: l
        } = await Func.getFile(M.thumbnail);
        var Q = await (await upload(fs.readFileSync(l))).data.url;
      } else {
        if (M.thumbnail && Buffer.isBuffer(M.thumbnail)) {
          var Q = await (await upload(M.thumbnail)).data.url;
        } else {
          if (M.thumbnail && Func.isUrl(M.thumbnail)) {
            var Q = M.thumbnail;
          } else {
            var Q = "https://i.postimg.cc/L6PLVMsv/rettiest.jpg";
          }
        }
      }
      return X.generateMessage(p, {
        'text': x,
        ...v,
        'contextInfo': {
          'mentionedJid': this.mention(x),
          'externalAdReply': {
            'title': M.title || "Starlight Bot",
            'body': M.body || null,
            'mediaType': 0x1,
            'thumbnailUrl': 'https://i.postimg.cc/L6PLVMsv/rettiest.jpg',
            'thumbnail': await Func.fetchBuffer("https://i.postimg.cc/L6PLVMsv/rettiest.jpg"),
            'sourceUrl': 'https://whatsapp.com/channel/0029VasSQy7DDmFSSfbKYv3N',
            'showAdAttribution': !!(M.ads && M.ads),
            'renderLargerThumbnail': !!(M.largeThumb && M.largeThumb),
            'containsAutoReply': false
          }
        }
      }, {
        'quoted': d,
        ...(D ? {
          'ephemeralExpiration': d?.["expiration"] || 0
        } : {})
      });
    }
    
    X.sendMessageModifyV3 = async (p, x, d, M, v = {}) => {
      if (M.thumbnail && !Func.isUrl(M.thumbnail)) {
        var {
          file: l
        } = await Func.getFile(M.thumbnail);
        var Q = await (await upload(fs.readFileSync(l))).data.url;
      } else {
        if (M.thumbnail && Buffer.isBuffer(M.thumbnail)) {
          var Q = await (await upload(M.thumbnail)).data.url;
        } else {
          if (M.thumbnail && Func.isUrl(M.thumbnail)) {
            var Q = M.thumbnail;
          } else {
            var Q = "https://i.postimg.cc/L6PLVMsv/rettiest.jpg";
          }
        }
      }
      return X.generateMessage(p, {
        'text': x,
        ...v,
        'contextInfo': {
          'mentionedJid': this.mention(x),
          'externalAdReply': {
            'title': M.title || "Starlight Bot",
            'body': M.body || null,
            'mediaType': 0x1,
            'thumbnailUrl': 'https://i.postimg.cc/L6PLVMsv/rettiest.jpg',
            'thumbnail': await Func.fetchBuffer("https://i.postimg.cc/L6PLVMsv/rettiest.jpg"),
            'sourceUrl': 'https://whatsapp.com/channel/0029VasSQy7DDmFSSfbKYv3N',
            'showAdAttribution': !!(M.ads && M.ads),
            'renderLargerThumbnail': !!(M.largeThumb && M.largeThumb),
            'containsAutoReply': false
          }
        }
      }, {
        'quoted': d,
        ...(D ? {
          'ephemeralExpiration': d?.["expiration"] || 0
        } : {})
      });
    };
    
    
    X.sendMessageModifyV4 = async (p, x, d, M, v = {}) => {
      const l = {
        'key': {
          'fromMe': false,
          'participant': "0@s.whatsapp.net",
          ...(p ? {
            'remoteJid': "status@broadcast"
          } : {})
        },
        'message': {
          'locationMessage': {
            'name': d || "starlight bot",
            'jpegThumbnail': await Func.createThumb(fs.readFileSync("./media/image/thumb.jpg"))
          }
        }
      };

      if (M.thumbnail && !Func.isUrl(M.thumbnail)) {
        var {
          file: Q
        } = await Func.getFile(M.thumbnail);
        var Z = await (await upload(fs.readFileSync(Q))).data.url;
      } else {
        if (M.thumbnail && Buffer.isBuffer(M.thumbnail)) {
          var Z = await (await upload(M.thumbnail)).data.url;
        } else {
          if (M.thumbnail && Func.isUrl(M.thumbnail)) {
            var Z = M.thumbnail;
          } else {
            var Z = "https://i.postimg.cc/pLLGhLQ9/image.jpg";
          }
        }
      }
      return X.generateMessage(p, {
        'text': x,
        ...v,
        'contextInfo': {
          'mentionedJid': this.mention(x),
          'title': M.title || "Starlight Bot",
          'body': M.body || null,
          'mediaType': 0x1,
          'thumbnailUrl': "https://i.postimg.cc/pLLGhLQ9/image.jpg",
          'thumbnail': await Func.fetchBuffer("https://i.postimg.cc/pLLGhLQ9/image.jpg"),
          'sourceUrl': 'https://whatsapp.com/channel/0029VasSQy7DDmFSSfbKYv3N',
          'showAdAttribution': !!(M.ads && M.ads),
          'renderLargerThumbnail': !!(M.largeThumb && M.largeThumb),
          'containsAutoReply': false
        }
      }, {
        'quoted': l,
        ...(D ? {
          'ephemeralExpiration': l?.["expiration"] || 0
        } : {})
      });
    };
    X.groupAdmin = async p => {
      try {
        let x = await (await X.groupMetadata(p)).participants;
        let d = [];
        for (let M of x) if (M.admin === "admin" || M.admin === "superadmin") {
          d.push(M.id);
        } else {
          '';
        }
        return d;
      } catch {
        return [];
      }
    };
    X.saveMediaMessage = async (p, x, d = true) => {
      let M = p.msg ? p.msg : p;
      let v = (p.msg || p).mimetype || '';
      let l = v.split('/')[0].replace("application", "document") ? v.split('/')[0].replace("application", "document") : v.split('/')[0];
      const Q = await downloadContentFromMessage(M, l);
      let Z = Buffer.from([]);
      for await (const g of Q) {
        Z = Buffer.concat([Z, g]);
      }
      let N = await FileType.fromBuffer(Z);
      let V = d ? x + '.' + N.ext : x;
      await fs.writeFileSync(V, Z);
      return V;
    };
    X.downloadMediaMessage = async p => {
      let x = (p.msg || p).mimetype || '';
      let d = p.mtype ? p.mtype.replace(/Message|WithCaption/gi, '') : x.split('/')[0];
      const M = await downloadContentFromMessage(p, d);
      let v = Buffer.from([]);
      for await (const l of M) {
        v = Buffer.concat([v, l]);
      }
      return v;
    };
    X.copyNForward = async (p, x, d = false, M = {}) => {
      let v;
      if (M.readViewOnce) {
        x.message = x.message && x.message.ephemeralMessage && x.message.ephemeralMessage.message ? x.message.ephemeralMessage.message : x.message || undefined;
        v = Object.keys(x.message.viewOnceMessage.message)[0];
        delete (x.message && x.message.ignore ? x.message.ignore : x.message || undefined);
        delete x.message.viewOnceMessage.message[v].viewOnce;
        x.message = {
          ...x.message.viewOnceMessage.message
        };
      }
      let l = Object.keys(x.message)[0];
      let Q = await generateForwardMessageContent(x, d);
      let Z = Object.keys(Q)[0];
      let N = {};
      if (l != "conversation") {
        N = x.message[l].contextInfo;
      }
      Q[Z].contextInfo = {
        ...N,
        ...Q[Z].contextInfo
      };
      const V = await generateWAMessageFromContent(p, Q, M ? {
        ...Q[Z],
        ...M,
        ...(M.contextInfo ? {
          'contextInfo': {
            ...Q[Z].contextInfo,
            ...M.contextInfo
          }
        } : {})
      } : {});
      await X.relayMessage(p, V.message, {
        'messageId': V.key.id,
        'additionalAttributes': {
          ...M
        }
      });
      return V;
    };
    X.reply = async (p, x, d, M = {}) => {
      
      return X.sendMessage(p, {
        'text': x,
        'mentions': this.mention(x),
        ...M
      }, {
        'quoted': d,
        ...(D ? {
          'ephemeralExpiration': d?.["expiration"] || 0
        } : {})
      });
    };
    X.sendMessageVerify = async (p, x, d, M = {}) => {
      const v = {
        'key': {
          'fromMe': false,
          'participant': "0@s.whatsapp.net",
          ...(p ? {
            'remoteJid': "status@broadcast"
          } : {})
        },
        'message': {
          'locationMessage': {
            'name': d || "© neoxr-bot",
            'jpegThumbnail': await Func.createThumb(fs.readFileSync("./media/image/thumb.jpg"))
          }
        },
        'expiration': 0x0
      };
      
      return X.sendMessage(p, {
        'text': x,
        'mentions': this.mention(x),
        ...M
      }, {
        'quoted': v,
        ...(D ? {
          'ephemeralExpiration': v?.["expiration"] || 0
        } : {})
      });
    };
    X.sendPoll = async (p, x, d, M, v = {}) => {
      if (d.options.length < 2) {
        return false;
      }
      const l = {
        'name': x,
        'values': d.options,
        'selectableCount': 0x1,
        'mentions': this.mention(x),
        ...v
      };
      return X.sendMessage(p, {
        'poll': l
      }, {
        'quoted': M
      });
    };
    X.sendPollV2 = async (p, x, d, M) => {
      if (!M) {
        M = {};
      }
      const v = {
        'name': x,
        'values': d,
        'selectableCount': 0x1,
        'mentions': this.mention(x),
        ...M
      };
      return X.relayMessage(p, {
        'pollCreationMessage': v
      }, {
        ...M
      });
    };
    X.sendSticker = async (p, x, d, M = {}) => {
      const v = /^https?:\/\//.test(x) ? await Func.fetchBuffer(x) : Buffer.isBuffer(x) ? x : /^data:.*?\/.*?;base64,/i.test(x) ? Buffer.from(x.split`,`[1], "base64") : Buffer.alloc(0);
      const {
        mime: l
      } = await FileType.fromBuffer(v);
      const Q = /image\/(jpe?g|png|gif)|octet/.test(l) ? M && (M.packname || M.author) ? await Exif.writeExifImg(v, M) : await Exif.imageToWebp(v) : /video/.test(l) ? M && (M.packname || M.author) ? await Exif.writeExifVid(v, M) : await Exif.videoToWebp(v) : /webp/.test(l) ? await Exif.writeExifWebp(v, M) : Buffer.alloc(0);
      
      return X.sendMessage(p, {
        'sticker': {
          'url': Q
        },
        ...M
      }, {
        'quoted': d,
        ...(D ? {
          'ephemeralExpiration': d?.["expiration"] || 0
        } : {})
      });
    };
    X.sendReact = async (p, x, d = {}) => {
      let M = {
        'react': {
          'text': x,
          'key': d
        }
      };
      return X.sendMessage(p, M);
    };
    X.sendContact = async (p, x, d, M = {}, v = {}) => {
  let l = [];
  x.map(Q => l.push({
    'displayName': Q.name,
    'vcard': "BEGIN:VCARD\nVERSION:3.0\nFN:" + Q.name + "\nORG:" + (M && M.org ? M.org : "") + "\nTEL;type=CELL;type=VOICE;waid=" + Q.number + ':' + PhoneNumber('+' + Q.number).getNumber("international") + "\nEMAIL;type=Email:" + (M && M.email ? M.email : "") + "\nURL;type=Website:" + (M && M.website ? M.website : "") + "\nADR;type=Location:;;Unknown;;" + (M && M.about ? M.about : Q.about) + "\nEND:VCARD"
  }));
  return X.sendMessage(p, {
    'contacts': {
      'displayName': l.length + " Contact",
      'contacts': l
    },
    ...v
  }, {
    'quoted': d,
    ...(D ? {
      'ephemeralExpiration': d?.["expiration"] || 0
    } : {})
  });
};

    X.sendPtv = async (p, x, d) => {
      const {
        status: M,
        file: v,
        filename: l,
        mime: Q,
        size: Z,
        extension: N
      } = await Func.getFile(x, d && d.referer ? d.referer : false);
      const V = await generateWAMessageContent({
        'video': fs.readFileSync('./' + v)
      }, {
        'upload': X.waUploadToServer
      });
      
      return await X.relayMessage(p, {
        'ptvMessage': V.videoMessage
      }, {});
    };
    X.sendProgress = async (p, x, d) => {
      const M = ["⬢⬡⬡⬡⬡⬡⬡⬡⬡⬡ 10%", "⬢⬢⬢⬡⬡⬡⬡⬡⬡⬡ 30%", "⬢⬢⬢⬢⬢⬡⬡⬡⬡⬡ 50%", "⬢⬢⬢⬢⬢⬢⬢⬢⬢⬢ 100%", x];
      X.reply(p, "⬡⬡⬡⬡⬡⬡⬡⬡⬡⬡ 0%", d).then(async l => {
        for (let Q of M) {
          await Func.delay(1000);
          X.relayMessage(p, {
            'protocolMessage': {
              'key': l.key,
              'type': 0xe,
              'editedMessage': {
                'conversation': Q
              }
            }
          }, {});
        }
      });
    };
    X.sendIAMessage = async (p, x = [], d, M = {}, v = {}) => {
      if (M.media) {
        var l = await Func.getFile(M.media);
        if (/image/.test(l.mime)) {
          var Q = await prepareWAMessageMedia({
            'image': {
              'url': l.file
            }
          }, {
            'upload': X.waUploadToServer
          });
          var Z = {
            'imageMessage': Q.imageMessage
          };
        } else {
          if (/video/.test(l.mime)) {
            var Q = await prepareWAMessageMedia({
              'video': {
                'url': l.file
              }
            }, {
              'upload': X.waUploadToServer
            });
            var Z = {
              'videoMessage': Q.videoMessage
            };
          } else {
            var Z = {};
          }
        }
      }
      const N = generateWAMessageFromContent(p, {
        'viewOnceMessage': {
          'message': {
            'messageContextInfo': {
              'deviceListMetadata': {},
              'deviceListMetadataVersion': 0x2
            },
            'interactiveMessage': {
              'header': proto.Message.InteractiveMessage.create({
                'title': M.header ? M.header : '',
                'subtitle': M.subtitle ? M.subtitle : '',
                'hasMediaAttachment': !!(M.media && /image|video/.test(l.mime)),
                ...Z
              }),
              'body': proto.Message.InteractiveMessage.create({
                'text': M.content ? M.content : ''
              }),
              'footer': proto.Message.InteractiveMessage.create({
                'text': M.footer ? M.footer : ''
              }),
              'nativeFlowMessage': proto.Message.InteractiveMessage.create({
                'buttons': x,
                'messageParamsJson': ''
              }),
              'contextInfo': {
                'mentionedJid': this.mention(M.content ? M.content : ''),
                ...v
              }
            }
          }
        }
      }, {
        'userJid': X.user.jid,
        'quoted': d,
        ...(D ? {
          'ephemeralExpiration': d?.["expiration"] || 0
        } : {})
      });
      
      X.relayMessage(p, N.message, {
        'messageId': N.key.id
      });
      return N;
    };
    X.sendCarousel = async (p, x = [], d = {}, M = {}) => {
      let l = [];
      for (const V of x) {
        var Q = await Func.getFile(V.header.imageMessage);
        var Z = await prepareWAMessageMedia({
          'image': {
            'url': Q.file
          }
        }, {
          'upload': X.waUploadToServer
        });
        l.push({
          'header': {
            'imageMessage': Z.imageMessage,
            'hasMediaAttachment': true
          },
          'body': V.body,
          'nativeFlowMessage': V.nativeFlowMessage
        });
      }
      const N = generateWAMessageFromContent(p, {
        'viewOnceMessage': {
          'message': {
            'interactiveMessage': {
              'body': {
                'text': M.content ? M.content : ''
              },
              'carouselMessage': {
                'cards': l,
                'messageVersion': 0x1
              },
              'footer': {
                'text': M.footer ? M.footer : ''
              }
            }
          }
        }
      }, {
        'userJid': X.user.jid,
        'quoted': d,
        ...(D ? {
          'ephemeralExpiration': d?.["expiration"] || 0
        } : {})
      });
      X.relayMessage(p, N.message, {
        'messageId': N.key.id
      });
      return N;
    };
    X.replyButton = async (p, x = [], d, M = {}, v = {}) => {
      let l = [];
      for (const g of x) {
        if (g?.["name"]) {
          l.push({
            'nativeFlowInfo': {
              'name': g.name,
              'paramsJson': JSON.stringify(g.param)
            },
            'type': "NATIVE_FLOW"
          });
        } else {
          l.push({
            'buttonId': g.command,
            'buttonText': {
              'displayText': g.text
            },
            'type': "RESPONSE"
          });
        }
      }
      if (M?.["media"]) {
        var Q = await Func.getFile(M.media);
        if (M?.["media"] && M?.["document"]) {
          var Z = await prepareWAMessageMedia({
            'document': {
              'url': Q.file
            },
            'fileName': M?.["document"]?.["filename"] || Q.filename,
            'mimetype': Q.mime
          }, {
            'upload': X.waUploadToServer
          });
          var N = {
            'documentMessage': Z.documentMessage
          };
        } else {
          if (/image/.test(Q.mime) && M?.["location"]) {
            var N = {
              'locationMessage': {
                'thumbnail': await Func.createThumb(M.media)
              }
            };
          } else {
            if (/image/.test(Q.mime) && M?.["product"]) {
              var Z = await prepareWAMessageMedia({
                'image': {
                  'url': Q.file
                }
              }, {
                'upload': X.waUploadToServer
              });
              var N = {
                'imageMessage': Z.imageMessage
              };
            } else {
              if (/image/.test(Q.mime)) {
                var Z = await prepareWAMessageMedia({
                  'image': {
                    'url': Q.file
                  }
                }, {
                  'upload': X.waUploadToServer
                });
                var N = {
                  'imageMessage': Z.imageMessage
                };
              } else {
                if (/video/.test(Q.mime)) {
                  var Z = await prepareWAMessageMedia({
                    'video': {
                      'url': Q.file
                    }
                  }, {
                    'upload': X.waUploadToServer
                  });
                  var N = {
                    'videoMessage': Z.videoMessage
                  };
                } else {
                  var N = {};
                }
              }
            }
          }
        }
      }
      const V = generateWAMessageFromContent(p, {
        'viewOnceMessage': {
          'message': {
            'messageContextInfo': {
              'deviceListMetadata': {},
              'deviceListMetadataVersion': 0x2
            },
            'buttonsMessage': {
              ...N,
              'contentText': M?.["text"] || '',
              'footerText': M?.["footer"] || '',
              'contextInfo': {
                'mentionedJid': this.mention(M?.["text"] || ''),
                ...v
              },
              'buttons': l,
              'headerType': N?.["imageMessage"] && M?.["product"] ? "PRODUCT" : N?.["documentMessage"] ? "DOCUMENT" : N?.["locationMessage"] ? "LOCATION" : N?.["imageMessage"] ? "IMAGE" : N?.["videoMessage"] ? "VIDEO" : "EMPTY"
            }
          }
        }
      }, {
        'userJid': X.user.jid,
        'quoted': d
      });
      
      X.relayMessage(p, V.message, {
        'messageId': V.key.id
      });
      return V;
    };
    X.sendFile = async (p, x, d, M = '', v, l, Q) => {
      const {
        status: Z,
        file: N,
        filename: V,
        mime: g,
        size: F,
        extension: f
      } = await Func.getFile(x, d, l && l.referer ? l.referer : false);
      X.refreshMediaConn(false);
      if (l && l.document) {
        
        const K = await Func.metaAudio(N, {
          'title': V.replace(new RegExp(".mp3", 'i'), ''),
          'album': l && l.album ? l.album : this.tags.album,
          'APIC': l && l.APIC ? l.APIC : this.tags.APIC
        });
        return X.sendMessage(p, {
          'document': {
            'url': f == "m4a" ? N : K.file
          },
          'fileName': V,
          'mimetype': g,
          'caption': M,
          ...Q
        }, {
          'quoted': v,
          ...(D ? {
            'ephemeralExpiration': v?.["expiration"] || 0
          } : {})
        });
      } else {
        if (/image\/(jpe?g|png)/.test(g)) {
          
          return X.sendMessage(p, {
            'image': {
              'url': N
            },
            'caption': M,
            'mentions': this.mention(M),
            ...Q
          }, {
            'quoted': v,
            ...(D ? {
              'ephemeralExpiration': v?.["expiration"] || 0
            } : {})
          });
        } else {
          if (/video/.test(g)) {
            
            return X.sendMessage(p, {
              'video': {
                'url': N
              },
              'caption': M,
              'gifPlayback': !!(l && l.gif),
              'mentions': this.mention(M),
              ...Q
            }, {
              'quoted': v,
              ...(D ? {
                'ephemeralExpiration': v?.["expiration"] || 0
              } : {})
            });
          } else {
            if (/audio/.test(g)) {
              /*await X.sendPresenceUpdate(l && l.ptt ? "recording" : "composing", p);*/
              const C = await Func.metaAudio(N, {
                'title': V.replace(new RegExp(".mp3", 'i'), ''),
                'album': l && l.album ? l.album : this.tags.album,
                'APIC': l && l.APIC ? l.APIC : this.tags.APIC
              });
              const t = !!(l && l.ptt);
              return X.sendMessage(p, {
                'audio': {
                  'url': f == "m4a" ? N : C.file
                },
                'ptt': t,
                'mimetype': g,
                'fileName': f == "m4a" ? N.filename : C.filename,
                'waveform': t ? [0, 3, 58, 44, 35, 32, 2, 4, 31, 35, 44, 34, 48, 13, 0, 54, 49, 40, 1, 44, 50, 51, 16, 0, 3, 40, 39, 46, 3, 42, 38, 44, 46, 0, 0, 47, 0, 0, 46, 19, 20, 48, 43, 49, 0, 0, 39, 40, 31, 18, 29, 17, 25, 37, 51, 22, 37, 34, 19, 11, 17, 12, 16, 19] : [],
                'mentions': this.mention(M),
                ...Q
              }, {
                'quoted': v,
                ...(D ? {
                  'ephemeralExpiration': v?.["expiration"] || 0
                } : {})
              });
            } else {
              
              return X.sendMessage(p, {
                'document': {
                  'url': N
                },
                'fileName': V,
                'mimetype': g,
                'caption': M,
                ...Q
              }, {
                'quoted': v,
                ...(D ? {
                  'ephemeralExpiration': v?.["expiration"] || 0
                } : {})
              });
            }
          }
        }
      }
    };
  };
};